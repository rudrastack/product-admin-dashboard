"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getProducts, searchProducts, getCategories, getProductsByCategory } from "@/services/products.api"; import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
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

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(
        searchParams.get("category") || ""
    ); const totalPages = Math.ceil(total / pageSize);
    const [searchLoading, setSearchLoading] = useState(false);
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
                        controller.signal
                    );
                } else if (category) {
                    data = await getProductsByCategory(
                        category,
                        pageSize,
                        skip,
                        controller.signal
                    );
                } else {
                    data = await getProducts(
                        pageSize,
                        skip,
                        controller.signal
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
    }, [page, pageSize, search, category]);

    useEffect(() => {
        if (totalPages > 0 && page > totalPages) {
            setPage(1);
            updateUrl(1, pageSize, search);
        }
    }, [totalPages, page]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.replace("/login");
    };

    const updateUrl = (
        newPage,
        newPageSize,
        newSearch,
        newCategory
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

        router.replace(`/products?${params.toString()}`);
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Loading products...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p className="text-red-600">{error}</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold md:text-3xl">
                            Products
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage your products
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
                    >
                        Logout
                    </button>
                </div>
                <div className="mb-6">
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
                        className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 md:max-w-md"
                    />
                </div>
                <div className="mb-6">
                    <select
                        value={category}
                        onChange={(event) => {
                            const value = event.target.value;

                            setCategory(value);
                            setPage(1);

                            updateUrl(1, pageSize, search, value);
                        }}
                        className="w-full rounded-lg border bg-white px-4 py-3 md:max-w-md"
                    >
                        <option value="">All Categories</option>

                        {categories.map((item) => (
                            <option
                                key={item.slug}
                                value={item.slug}
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                {products.length === 0 ? (
                    <div className="rounded-xl border bg-white p-10 text-center">
                        <p className="text-gray-500">
                            No products found.
                        </p>
                    </div>
                ) : (
                    <>
                        <ProductTable products={products} />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
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
                                    updateUrl(newPage, pageSize, search, category);
                                }} onPageSizeChange={(newPageSize) => {
                                    setPageSize(newPageSize);
                                    setPage(1);
                                    updateUrl(1, newPageSize, search, category);
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}