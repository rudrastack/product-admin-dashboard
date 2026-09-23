"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/services/products.api";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        setProducts(data.products);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading products...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Products
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>

      <p className="mt-4">
        Total Products: {products.length}
      </p>
    </main>
  );
}