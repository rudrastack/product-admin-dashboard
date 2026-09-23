import Link from "next/link";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-48 w-full rounded-lg object-cover"
      />

      <div className="mt-4">
        <Link
          href={`/products/${product.id}`}
          className="font-semibold hover:underline"
        >
          {product.title}
        </Link>

        <p className="mt-1 text-sm capitalize text-gray-500">
          {product.category}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold">
            ${product.price}
          </span>

          <span className="text-sm">
            ⭐ {product.rating}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          Stock: {product.stock}
        </p>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className="flex-1 rounded-lg border px-3 py-2 text-sm text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}