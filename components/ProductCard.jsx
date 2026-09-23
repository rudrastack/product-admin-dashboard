import Link from "next/link";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(25,25,24,0.04)]">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-48 w-full border-b border-[var(--line)] bg-[#f4f3ef] object-cover"
      />

      <div className="p-5">
        <Link
          href={`/products/${product.id}`}
          className="block truncate font-semibold text-[#191918] transition-colors hover:underline"
        >
          {product.title}
        </Link>

        <p className="mt-2 inline-flex rounded-md bg-[#f1f0ed] px-2.5 py-1 text-xs font-semibold capitalize text-[#5f5d58]">
          {product.category}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-bold text-[#191918]">
            ${Number(product.price).toFixed(2)}
          </span>

          <span className="text-sm font-medium text-[#5f5d58]">
            <span className="mr-1 text-[#8d887c]">*</span>{product.rating}
          </span>
        </div>

        <p className="mt-2 text-sm text-[#667085]">
          <span className="font-semibold text-[#4f4d48]">{product.stock}</span> units in stock
        </p>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={() => onEdit(product)}
            className="rounded-md border border-[var(--line)] px-3 py-2.5 text-sm font-semibold text-[#4f4d48] transition-colors hover:border-[#bcb9b2] hover:bg-[#f8f7f4] hover:text-[#191918]"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="rounded-md border border-[#ead4d1] px-3 py-2.5 text-sm font-semibold text-[#9b4540] transition-colors hover:bg-[#fff8f7]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}