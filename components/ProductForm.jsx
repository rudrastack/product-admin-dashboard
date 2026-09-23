"use client";

import { useState } from "react";

export default function ProductForm({ product, onSuccess, onCancel }) {
    const [form, setForm] = useState({
        title: product?.title || "",
        price: product?.price || "",
        description: product?.description || "",
        category: product?.category || "",
        stock: product?.stock || "",
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
            });

            setForm({
                title: "",
                price: "",
                description: "",
                category: "",
                stock: "",
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
            className="rounded-xl border bg-white p-6"
        >
            <h2 className="mb-4 text-xl font-bold">
                {product ? "Edit Product" : "Add Product"}
            </h2>

            {error && (
                <p className="mb-4 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Product title"
                    className="rounded-lg border px-4 py-3"
                />

                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="rounded-lg border px-4 py-3"
                />

                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="rounded-lg border px-4 py-3"
                />

                <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    className="rounded-lg border px-4 py-3"
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="rounded-lg border px-4 py-3 md:col-span-2"
                    rows={4}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-4 rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
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
                    className="ml-3 rounded-lg border px-5 py-3"
                >
                    Cancel
                </button>
            )}
        </form>
    );
}