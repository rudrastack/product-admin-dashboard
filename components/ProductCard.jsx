export default function ProductCard({ product }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-48 w-full rounded-lg object-cover"
      />

      <div className="mt-4">
        <h2 className="font-semibold">
          {product.title}
        </h2>

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
      </div>
    </div>
  );
}   