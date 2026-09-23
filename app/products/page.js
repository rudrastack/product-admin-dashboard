"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getProducts, searchProducts, getCategories, getProductsByCategory, addProduct, updateProduct, deleteProduct } from "@/services/products.api"; import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { useSearchParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";

function ProductsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const getValidPage = () => {
        const value = Number(searchParams.get("page"));

        if (!Number.isInteger(value) || value < 1) {
            return 1;
        }

        return value;
    };
    const getValidPageSize = () => {
        const value = Number(searchParams.get("pageSize"));

        if (![10, 20, 50].includes(value)) {
            return 10;
        }

        return value;
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(getValidPage());
    const [pageSize, setPageSize] = useState(getValidPageSize());
    const [retryCount, setRetryCount] = useState(0);

    const [search, setSearch] = useState(searchParams.get("search") || "");

    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
    const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc");
    const totalPages = Math.ceil(total / pageSize);

    const [searchLoading, setSearchLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteProductId, setDeleteProductId] = useState(null);

    const startItem =
        total === 0
            ? 0
            : (page - 1) * pageSize + 1;

    const endItem = Math.min(
        page * pageSize,
        total
    );

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const fetchProducts = async () => {
            try {
                setError("");

                if (search.trim()) {
                    setSearchLoading(true);
                } else {
                    setLoading(true);
                }

                const skip = (page - 1) * pageSize;

                let data;
                if (search.trim()) {
                    data = await searchProducts(
                        search.trim(),
                        pageSize,
                        skip,
                        controller.signal,
                        sortBy,
                        sortOrder
                    );
                } else if (category) {
                    data = await getProductsByCategory(
                        category,
                        pageSize,
                        skip,
                        controller.signal,
                        sortBy,
                        sortOrder
                    );
                } else {
                    data = await getProducts(
                        pageSize,
                        skip,
                        controller.signal,
                        sortBy,
                        sortOrder
                    );
                }

                setProducts(data.products);
                setTotal(data.total);
            } catch (error) {
                if (error.name !== "CanceledError") {
                    setError("Failed to load products");
                }
            } finally {
                setLoading(false);
                setSearchLoading(false);
            }
        };

        // Debounce only when searching
        if (search.trim()) {
            const timer = setTimeout(() => {
                fetchProducts();
            }, 500);

            return () => {
                clearTimeout(timer);
                controller.abort();
            };
        }

        // Pagination / normal products: call immediately
        fetchProducts();

        return () => {
            controller.abort();
        };
    }, [page, pageSize, search, category, sortBy, sortOrder, retryCount]);

    const updateUrl = (
        newPage,
        newPageSize,
        newSearch,
        newCategory,
        newSortBy,
        newSortOrder

    ) => {
        const params = new URLSearchParams();

        params.set("page", newPage);
        params.set("pageSize", newPageSize);

        if (newSearch.trim()) {
            params.set("search", newSearch.trim());
        }

        if (newCategory) {
            params.set("category", newCategory);
        }
        if (newSortBy) {
            params.set("sortBy", newSortBy);
            params.set("sortOrder", newSortOrder);
        }

        router.replace(`/products?${params.toString()}`);
    };

    useEffect(() => {
        if (totalPages > 0 && page > totalPages) {
            // Keep the URL and local page state aligned after a result set shrinks.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPage(1);
            updateUrl(1, pageSize, search);
        }
    }, [totalPages, page, pageSize, search]);

    const handleAddProduct = async (newProduct) => {
        const createdProduct = await addProduct(newProduct);

        setProducts((previous) => [
            createdProduct,
            ...previous,
        ]);

        setTotal((previous) => previous + 1);
    };

    const handleUpdateProduct = async (updatedProduct) => {
        const data = await updateProduct(
            editingProduct.id,
            updatedProduct
        );

        setProducts((previous) =>
            previous.map((product) =>
                product.id === editingProduct.id
                    ? {
                        ...product,
                        ...data,
                    }
                    : product
            )
        );

        setEditingProduct(null);
    };

    const handleDeleteProduct = async (id) => {
        setDeleteProductId(id);
    };

    const confirmDeleteProduct = async () => {
        const id = deleteProductId;
        setDeleteProductId(null);

        try {
            await deleteProduct(id);

            setProducts((previous) =>
                previous.filter((product) => product.id !== id)
            );

            setTotal((previous) => Math.max(previous - 1, 0));
        } catch (error) {
            setError("Failed to delete product");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.replace("/login");
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[var(--background)] p-4 md:p-8">
                <div className="mx-auto max-w-7xl animate-pulse">
                    <div className="mb-8 flex items-center justify-between">
                        <div><div className="h-8 w-40 rounded bg-[#e4e9f2]" /><div className="mt-3 h-4 w-64 rounded bg-[#e4e9f2]" /></div>
                        <div className="h-10 w-24 rounded-lg bg-[#e4e9f2]" />
                    </div>
                        <div className="h-28 rounded-xl border border-[var(--line)] bg-white" />
                        <div className="mt-6 h-96 rounded-xl border border-[var(--line)] bg-white" />
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[var(--background)] px-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f1eeea] text-xl font-bold text-[#6d6961]">!</div>
                <p className="text-center font-medium text-[#6d6961]">
                    {error}
                </p>

                <button
                    onClick={() => setRetryCount((previous) => previous + 1)}
                    className="rounded-md bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-dark)]"
                >
                    Retry
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--background)] p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#716d64]">Workspace / Catalog</p>
                        <h1 className="text-3xl font-bold tracking-tight text-[#191918] md:text-4xl">
                            Products
                        </h1>

                        <p className="mt-2 max-w-lg text-sm text-[#73716c]">
                            Manage your catalog, monitor inventory, and keep product information up to date.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="self-start rounded-md border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold text-[#5f5d58] transition-colors hover:border-[#bcb9b2] hover:bg-[#f8f7f4] hover:text-[#191918] sm:self-auto"
                    >
                        Logout
                    </button>
                </div>
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-[#4f4d48]">Product inventory</p>
                        <p className="mt-1 text-sm text-[#73716c]">{total} total products</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm((previous) => !previous)}
                        className="rounded-md bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(25,25,24,0.14)] transition-colors hover:bg-[var(--brand-dark)]"
                    >
                        <span className="mr-2 text-lg leading-none">{showAddForm ? "-" : "+"}</span>{showAddForm ? "Close Form" : "Add Product"}
                    </button>
                </div>
                {showAddForm && (
                    <div className="mb-6">
                        <ProductForm
                            onSuccess={async (newProduct) => {
                                await handleAddProduct(newProduct);
                                setShowAddForm(false);
                            }}
                        />
                    </div>
                )}
                {editingProduct && (
                    <div className="mb-6">
                        <ProductForm
                            product={editingProduct}
                            onSuccess={handleUpdateProduct}
                            onCancel={() => setEditingProduct(null)}
                        />
                    </div>
                )}
                <div className="mb-6 rounded-xl border border-[var(--line)] bg-white p-4 shadow-[0_8px_24px_rgba(25,25,24,0.035)] md:p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#191918]">Find products</p>
                        {searchLoading && <span className="text-xs font-medium text-[#716d64]">Searching...</span>}
                    </div>
                    <div className="grid gap-3 md:grid-cols-[minmax(240px,1.6fr)_1fr_1fr_1fr]">
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#98a2b3]">⌕</span>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(event) => {
                            const value = event.target.value;

                            setSearch(value);
                            setPage(1);

                            updateUrl(1, pageSize, value, category);
                        }}
                        className="w-full rounded-md border border-[var(--line)] bg-[#fcfbf9] py-3 pl-11 pr-4 text-sm outline-none transition-shadow placeholder:text-[#aaa7a0] hover:border-[#bcb9b2] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
                    />
                    </div>
                    <select
                        value={category}
                        onChange={(event) => {
                            const value = event.target.value;

                            setCategory(value);
                            setPage(1);

                            updateUrl(1, pageSize, search, value);
                        }}
                        className="w-full rounded-md border border-[var(--line)] bg-[#fcfbf9] px-4 py-3 text-sm text-[#5f5d58] outline-none transition-shadow hover:border-[#bcb9b2] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
                    >
                        <option value="">All categories</option>

                        {categories.map((item) => (
                            <option key={item.slug} value={item.slug}>{item.name}</option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(event) => {
                            const value = event.target.value;

                            setSortBy(value);
                            setPage(1);

                            updateUrl(1, pageSize, search, category, value, sortOrder);
                        }}
                        className="w-full rounded-md border border-[var(--line)] bg-[#fcfbf9] px-4 py-3 text-sm text-[#5f5d58] outline-none transition-shadow hover:border-[#bcb9b2] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
                    >
                        <option value="">Sort by</option>
                        <option value="price">Price</option>
                        <option value="rating">Rating</option>
                        <option value="title">Title</option>
                    </select>
                    {sortBy ? (
                        <select
                            value={sortOrder}
                            onChange={(event) => {
                                const value = event.target.value;

                                setSortOrder(value);

                                updateUrl(1, pageSize, search, category, sortBy, value);
                            }}
                            className="w-full rounded-md border border-[var(--line)] bg-[#fcfbf9] px-4 py-3 text-sm text-[#5f5d58] outline-none transition-shadow hover:border-[#bcb9b2] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    ) : <div className="hidden md:block" />}
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#c9c6be] bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#f1f0ed] text-2xl text-[#716d64]">+</div>
                        <p className="mt-5 font-semibold text-[#191918]">No products found</p>
                        <p className="mt-2 text-sm text-[#73716c]">Try changing your search or filters.</p>
                    </div>
                ) : (
                    <>
                        <ProductTable
                            products={products}
                            onEdit={setEditingProduct}
                            onDelete={handleDeleteProduct}

                        />


                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={setEditingProduct}
                                    onDelete={handleDeleteProduct}
                                />
                            ))}
                        </div>

                        {/* Pagination goes HERE */}
                        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {startItem}–{endItem} of {total}
                            </p>

                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                pageSize={pageSize}
                                onPageChange={(newPage) => {
                                    setPage(newPage);
                                    updateUrl(newPage, pageSize, search, category, sortBy, sortOrder);
                                }} onPageSizeChange={(newPageSize) => {
                                    setPageSize(newPageSize);
                                    setPage(1);
                                    updateUrl(1, newPageSize, search, category, sortBy, sortOrder);
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
            {deleteProductId && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-[#172033]/35 px-4 backdrop-blur-[2px]">
                    <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-6 shadow-[0_20px_50px_rgba(23,32,51,0.2)]">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0f0] text-lg font-bold text-[#c43d3d]">!</div>
                        <h2 className="mt-5 text-xl font-bold text-[#172033]">Delete this product?</h2>
                        <p className="mt-2 text-sm leading-6 text-[#667085]">This action will remove the product from your current catalog view. You can cancel if you are not ready.</p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setDeleteProductId(null)} className="rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-[#475467] hover:bg-[#f8faff]">Cancel</button>
                            <button onClick={confirmDeleteProduct} className="rounded-lg bg-[#c43d3d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a93232]">Delete product</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<main className="min-h-screen bg-[var(--background)]" />}>
            <ProductsPageContent />
        </Suspense>
    );
}