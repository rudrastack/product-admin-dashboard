"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/services/products.api";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();

      setProducts(data.products);
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">
        Product Admin Dashboard
      </h1>

      <p className="mt-4">
        Total Products: {products.length}
      </p>
    </main>
  );
}