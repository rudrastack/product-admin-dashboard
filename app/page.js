"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/services/products.api";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();

      setProducts(data.products);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
  }, []);

  const categoryCount = new Set(products.map((product) => product.category)).size;
  const averageRating = products.length
    ? (products.reduce((sum, product) => sum + Number(product.rating || 0), 0) / products.length).toFixed(1)
    : "0.0";
  const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);

  const handleNavigation = () => {
    router.push(isLoggedIn ? "/products" : "/login");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[#191918]">
      <nav className="border-b border-[var(--line)] bg-[#f7f6f3]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#191918] text-sm font-bold text-white">
              P
            </div>
            <span className="text-sm font-semibold tracking-tight sm:text-base">
              Product Admin
            </span>
          </div>

          <button
            onClick={handleNavigation}
            aria-label={isLoggedIn ? "Go to Dashboard" : "Login"}
            title={isLoggedIn ? "Go to Dashboard" : "Login"}
            className={`rounded-md bg-[#191918] text-white shadow-[0_5px_12px_rgba(25,25,24,0.12)] transition-colors hover:bg-black ${isLoggedIn ? "px-4 py-2.5 text-sm font-semibold" : "p-2.5"}`}
          >
            {isLoggedIn ? "Go to Dashboard" : (
              <svg aria-hidden="true" className="h-5 w-5 fill-current" viewBox="0 0 122.88 122.88">
                <path d="M61.44,0c8.32,0,16.25,1.66,23.5,4.66l0.11,0.05c7.47,3.11,14.2,7.66,19.83,13.3c5.66,5.65,10.22,12.42,13.34,19.95c3.01,7.24,4.66,15.18,4.66,23.49c0,8.32-1.66,16.25-4.66,23.5l-0.05,0.11c-3.12,7.47-7.66,14.2-13.3,19.83c-5.65,5.66-12.42,10.22-19.95,13.34c-7.24,3.01-15.18,4.66-23.49,4.66c-8.31,0-16.25-1.66-23.5-4.66l-0.11-0.05c-7.47-3.11-14.2-7.66-19.83-13.29L18,104.87C12.34,99.21,7.78,92.45,4.66,84.94C1.66,77.69,0,69.76,0,61.44s1.66-16.25,4.66-23.5l0.05-0.11c3.11-7.47,7.66-14.2,13.29-19.83L18.01,18c5.66-5.66,12.42-10.22,19.94-13.34C45.19,1.66,53.12,0,61.44,0L61.44,0z M16.99,94.47l0.24-0.14c5.9-3.29,21.26-4.38,27.64-8.83c0.47-0.7,0.97-1.72,1.46-2.83c0.73-1.67,1.4-3.5,1.82-4.74c-1.78-2.1-3.31-4.47-4.77-6.8l-4.83-7.69c-1.76-2.64-2.68-5.04-2.74-7.02c-0.03-0.93,0.13-1.77,0.48-2.52c0.36-0.78,0.91-1.43,1.66-1.93c0.35-0.24,0.74-0.44,1.17-0.59c-0.32-4.17-0.43-9.42-0.23-13.82c0.1-1.04,0.31-2.09,0.59-3.13c1.24-4.41,4.33-7.96,8.16-10.4c2.11-1.35,4.43-2.36,6.84-3.04c1.54-0.44-1.31-5.34,0.28-5.51c7.67-0.79,20.08,6.22,25.44,12.01c2.68,2.9,4.37,6.75,4.73,11.84l-0.3,12.54c1.34,0.41,2.2,1.26,2.54,2.63c0.39,1.53-0.03,3.67-1.33,6.6c-0.02,0.05-0.05,0.11-0.08,0.16l-5.51,9.07c-2.02,3.33-4.08,6.68-6.75,9.31C73.75,80,74,80.35,74.24,80.7c1.09,1.6,2.19,3.2,3.6,4.63c0.05,0.05,0.09,0.1,0.12,0.15c6.34,4.48,21.77,5.57,27.69,8.87l0.24,0.14c6.87-9.22,10.93-20.65,10.93-33.03c0-15.29-6.2-29.14-16.22-39.15c-10-10.03-23.85-16.23-39.14-16.23c-15.29,0-29.14,6.2-39.15,16.22C12.27,32.3,6.07,46.15,6.07,61.44C6.07,73.82,10.13,85.25,16.99,94.47L16.99,94.47L16.99,94.47z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24 lg:pb-24 lg:pt-28">
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#716d64]">
              Catalog operations / 2026
            </p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-[#191918] sm:text-6xl lg:text-7xl">
              Product Admin Dashboard
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#73716c] sm:text-lg">
              A clear, considered workspace for managing your catalog, inventory, and product details in one place.
            </p>
            <button
              onClick={handleNavigation}
              className="mt-9 rounded-md bg-[#191918] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(25,25,24,0.14)] transition-transform hover:-translate-y-0.5 hover:bg-black"
            >
              {isLoggedIn ? "Open dashboard" : "Enter workspace"}
              <span className="ml-3">&rarr;</span>
            </button>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-[var(--line)] bg-white p-6 shadow-[0_14px_34px_rgba(25,25,24,0.045)] sm:p-8">
            <div className="absolute right-0 top-0 h-24 w-24 border-b border-l border-[#e9e6df] bg-[#fbfaf8]" />
            <div className="relative">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#aaa7a0]">Overview</span>
                <span className="h-2 w-2 rounded-full bg-[#8d887c]" />
              </div>
              <p className="mt-8 text-sm text-[#73716c]">Total products</p>
              <p className="mt-2 text-6xl font-bold tracking-[-0.05em] text-[#191918]">{products.length}</p>
              <div className="mt-9 h-1.5 overflow-hidden rounded-full bg-[#efede8]">
                <div className="h-full w-3/4 bg-[#191918]" />
              </div>
              <p className="mt-3 text-xs text-[#aaa7a0]">Catalog data at a glance</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white">
        <div className="mx-auto grid max-w-7xl divide-y divide-[var(--line)] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          <div className="py-7 sm:px-8 sm:py-9 sm:first:pl-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#aaa7a0]">Products</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-[#191918]">{products.length}</p>
            <p className="mt-1 text-sm text-[#73716c]">Items in your catalog</p>
          </div>
          <div className="py-7 sm:px-8 sm:py-9">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#aaa7a0]">Categories</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-[#191918]">{categoryCount}</p>
            <p className="mt-1 text-sm text-[#73716c]">Distinct product groups</p>
          </div>
          <div className="py-7 sm:px-8 sm:py-9 sm:last:pr-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#aaa7a0]">Inventory</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-[#191918]">{totalStock}</p>
            <p className="mt-1 text-sm text-[#73716c]">Units currently tracked</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#716d64]">Built for clarity</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] text-[#191918] sm:text-4xl">Everything important, close at hand.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="border-t border-[var(--line)] pt-5">
              <p className="text-sm font-semibold text-[#4f4d48]">Focused catalog control</p>
              <p className="mt-2 text-sm leading-6 text-[#73716c]">Search, filter, sort, and update products without losing context.</p>
            </div>
            <div className="border-t border-[var(--line)] pt-5">
              <p className="text-sm font-semibold text-[#4f4d48]">A considered workflow</p>
              <p className="mt-2 text-sm leading-6 text-[#73716c]">Move from a high-level overview to individual product details in one step.</p>
            </div>
            <div className="border-t border-[var(--line)] pt-5">
              <p className="text-sm font-semibold text-[#4f4d48]">Average product rating</p>
              <p className="mt-2 text-2xl font-bold text-[#191918]"><span className="mr-1 text-[#8d887c]">*</span>{averageRating}</p>
            </div>
            <div className="border-t border-[var(--line)] pt-5">
              <p className="text-sm font-semibold text-[#4f4d48]">Ready when you are</p>
              <button onClick={handleNavigation} className="mt-2 text-sm font-semibold text-[#191918] underline decoration-[#aaa7a0] underline-offset-4 transition-colors hover:decoration-[#191918]">
                {isLoggedIn ? "Go to dashboard" : "Sign in to begin"} &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}