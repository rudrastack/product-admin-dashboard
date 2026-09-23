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
            <main className="flex min-h-screen items-center justify-center">
                <p>Loading product...</p>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">
                    Product Not Found
                </h1>

                <button
                    onClick={() => router.push("/products")}
                    className="rounded-lg bg-black px-4 py-2 text-white"
                >
                    Back to Products
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="mx-auto max-w-6xl rounded-xl bg-white p-6">
                <button
                    onClick={() => router.push("/products")}
                    className="mb-6 rounded-lg border px-4 py-2"
                >
                    ← Back
                </button>

                <div className="grid gap-8 md:grid-cols-2">
                    <div>
                        <img
                            src={product.images?.[0]}
                            alt={product.title}
                            className="h-96 w-full rounded-xl object-cover"
                        />

                        <div className="mt-4 flex gap-3 overflow-x-auto">
                            {product.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${product.title} ${index + 1}`}
                                    className="h-20 w-20 rounded-lg border object-cover"
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">
                            {product.title}
                        </h1>

                        <p className="mt-2 capitalize text-gray-500">
                            {product.category}
                        </p>

                        <p className="mt-6 text-2xl font-bold">
                            ${product.price}
                        </p>

                        <p className="mt-6 text-gray-600">
                            {product.description}
                        </p>

                        <p className="mt-4">
                            ⭐ {product.rating}
                        </p>

                        <p className="mt-2">
                            Stock: {product.stock}
                        </p>
                        <div className="mt-8 border-t pt-6">
                            <h2 className="text-xl font-bold">
                                Reviews
                            </h2>

                            {product.reviews?.length > 0 ? (
                                <div className="mt-4 space-y-4">
                                    {product.reviews.map((review, index) => (
                                        <div
                                            key={index}
                                            className="rounded-lg border p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold">
                                                    {review.reviewerName}
                                                </p>

                                                <span>
                                                    ⭐ {review.rating}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-gray-600">
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