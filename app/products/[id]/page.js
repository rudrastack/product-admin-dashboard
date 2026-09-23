"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getProductById } from "@/services/products.api";

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProductById(
                    params.id,
                    controller.signal
                );

                setProduct(data);
            } catch (error) {
                if (error.name !== "CanceledError") {
                    setError("Product not found");
                }
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }

        return () => {
            controller.abort();
        };
    }, [params.id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[var(--background)] p-4 md:p-8">
                <div className="mx-auto max-w-6xl animate-pulse rounded-2xl border border-[var(--line)] bg-white p-6">
                    <div className="h-10 w-28 rounded-md bg-[#e6e3dd]" />
                    <div className="mt-8 grid gap-8 md:grid-cols-2"><div className="h-96 rounded-xl bg-[#e6e3dd]" /><div><div className="h-10 w-3/4 rounded bg-[#e6e3dd]" /><div className="mt-5 h-6 w-1/3 rounded bg-[#e6e3dd]" /><div className="mt-8 h-24 rounded bg-[#e6e3dd]" /></div></div>
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[var(--background)] px-4">
                <h1 className="text-2xl font-bold text-[#172033]">
                    Product Not Found
                </h1>

                <button
                    onClick={() => router.push("/products")}
                    className="rounded-md bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-dark)]"
                >
                    Back to Products
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--background)] p-4 md:p-8">
            <div className="mx-auto max-w-6xl rounded-xl border border-[var(--line)] bg-white p-5 shadow-[0_10px_30px_rgba(25,25,24,0.035)] sm:p-7">
                <button
                    onClick={() => router.push("/products")}
                    className="mb-8 rounded-md border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-[#5f5d58] transition-colors hover:bg-[#f8f7f4]"
                >
                    <span className="mr-2">&larr;</span> Back to products
                </button>

                <div className="grid gap-8 md:grid-cols-2">
                    <div>
                        <img
                            src={product.images?.[0]}
                            alt={product.title}
                            className="h-72 w-full rounded-xl border border-[var(--line)] bg-[#f4f3ef] object-cover sm:h-96"
                        />

                        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                            {product.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${product.title} ${index + 1}`}
                                    className="h-20 w-20 rounded-lg border border-[var(--line)] object-cover transition-colors hover:border-[#8d887c]"
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="mb-3 inline-flex rounded-md bg-[#f1f0ed] px-2.5 py-1 text-xs font-semibold capitalize text-[#5f5d58]">{product.category}</p>
                        <h1 className="text-3xl font-bold tracking-tight text-[#191918] md:text-4xl">
                            {product.title}
                        </h1>

                        <p className="mt-6 text-3xl font-bold text-[#191918]">
                            ${Number(product.price).toFixed(2)}
                        </p>

                        <p className="mt-5 leading-7 text-[#73716c]">
                            {product.description}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-[#f8f7f4] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[#aaa7a0]">Rating</p><p className="mt-1 font-semibold text-[#4f4d48]"><span className="mr-1 text-[#8d887c]">*</span>{product.rating}</p></div>
                            <div className="rounded-lg bg-[#f8f7f4] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[#aaa7a0]">Stock</p><p className="mt-1 font-semibold text-[#4f4d48]">{product.stock} units</p></div>
                        </div>
                        <div className="mt-8 border-t border-[var(--line)] pt-6">
                            <h2 className="text-xl font-bold text-[#191918]">
                                Reviews
                            </h2>

                            {product.reviews?.length > 0 ? (
                                <div className="mt-4 space-y-4">
                                    {product.reviews.map((review, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border border-[var(--line)] bg-[#fcfbf9] p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold">
                                                    {review.reviewerName}
                                                </p>

                                                    <span className="text-sm font-medium text-[#475467]">
                                                        <span className="mr-1 text-[#8d887c]">*</span>{review.rating}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm leading-6 text-[#73716c]">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-4 text-gray-500">
                                    No reviews available.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}