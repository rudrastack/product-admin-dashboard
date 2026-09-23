"use client";

import { useState } from "react";

export default function ProductForm({ product, onSuccess, onCancel }) {
    const [form, setForm] = useState({
        title: product?.title || "",
        price: product?.price || "",
        description: product?.description || "",
        category: product?.category || "",
        stock: product?.stock || "",
        thumbnail: product?.thumbnail || "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const isValidImageUrl = (value) => {
        try {
            const url = new URL(value);
            return ["http:", "https:"].includes(url.protocol);
        } catch {
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!form.title.trim()) {
            setError("Title is required");
            return;
        }

        if (!form.price || Number(form.price) <= 0) {
            setError("Price must be greater than 0");
            return;
        }

        if (!form.category.trim()) {
            setError("Category is required");
            return;
        }

        if (!form.stock || Number(form.stock) < 0) {
            setError("Stock cannot be negative");
            return;
        }

        setLoading(true);

        try {
            await onSuccess({
                title: form.title.trim(),
                price: Number(form.price),
                description: form.description.trim(),
                category: form.category.trim(),
                stock: Number(form.stock),
                thumbnail: form.thumbnail.trim(),
            });

            setForm({
                title: "",
                price: "",
                description: "",
                category: "",
                stock: "",
                thumbnail: "",
            });
        } catch (error) {
            setError("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-[var(--line)] bg-white p-5 shadow-[0_8px_24px_rgba(25,25,24,0.035)] sm:p-7"
        >
            <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#716d64]">Catalog</p>
            <h2 className="mt-1 text-xl font-bold text-[#191918]">
                {product ? "Edit Product" : "Add Product"}
            </h2>
            <p className="mt-1 text-sm text-[#73716c]">Keep your product information accurate and easy to scan.</p>
            </div>

            {error && (
                <p className="mb-5 rounded-md border border-[#ead4d1] bg-[#fff8f7] px-4 py-3 text-sm font-medium text-[#9b4540]">
                    {error}
                </p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-[#4f4d48]">Product title
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Wireless headphones"
                    className="mt-2 w-full rounded-md border border-[var(--line)] px-4 py-3 font-normal text-[#191918] outline-none transition-shadow placeholder:text-[#aaa7a0] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
                />
                </label>

                <label className="text-sm font-semibold text-[#4f4d48]">Price
                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="mt-2 w-full rounded-md border border-[var(--line)] px-4 py-3 font-normal text-[#191918] outline-none transition-shadow placeholder:text-[#aaa7a0] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
                />
                </label>

                <label className="text-sm font-semibold text-[#4f4d48]">Category
                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. audio"
                    className="mt-2 w-full rounded-md border border-[var(--line)] px-4 py-3 font-normal text-[#191918] outline-none transition-shadow placeholder:text-[#aaa7a0] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
                />
                </label>

                <label className="text-sm font-semibold text-[#4f4d48]">Stock quantity
                <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-2 w-full rounded-md border border-[var(--line)] px-4 py-3 font-normal text-[#191918] outline-none transition-shadow placeholder:text-[#aaa7a0] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
                />
                </label>

                <label className="text-sm font-semibold text-[#4f4d48] md:col-span-2">Image URL
                <input
                    name="thumbnail"
                    type="url"
                    value={form.thumbnail}
                    onChange={handleChange}
                    placeholder="https://example.com/product-image.jpg"
                    className="mt-2 w-full rounded-md border border-[var(--line)] px-4 py-3 font-normal text-[#191918] outline-none transition-shadow placeholder:text-[#aaa7a0] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
                />
                {isValidImageUrl(form.thumbnail.trim()) && (
                    <div className="mt-3 flex items-center gap-3">
                        <img
                            src={form.thumbnail.trim()}
                            alt="Product preview"
                            className="h-16 w-16 rounded-md border border-[var(--line)] bg-[#f4f3ef] object-cover"
                        />
                        <span className="text-xs text-[#73716c]">Image preview</span>
                    </div>
                )}
                </label>

                <label className="text-sm font-semibold text-[#4f4d48] md:col-span-2">Description
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Add a short description of this product"
                    className="mt-2 w-full rounded-md border border-[var(--line)] px-4 py-3 font-normal text-[#191918] outline-none transition-shadow placeholder:text-[#aaa7a0] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
                    rows={4}
                />
                </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-6 rounded-md bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-[0_5px_12px_rgba(25,25,24,0.14)] transition-colors hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading
                    ? "Saving..."
                    : product
                        ? "Update Product"
                        : "Add Product"}
            </button>

            {product && onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="ml-2 rounded-md border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[#5f5d58] transition-colors hover:bg-[#f8f7f4]"
                >
                    Cancel
                </button>
            )}
        </form>
    );
}