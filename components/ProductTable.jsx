import Link from "next/link";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border bg-white md:block">
      <table className="w-full text-left">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold">
              Product
            </th>

            <th className="px-6 py-4 text-sm font-semibold">
              Category
            </th>

            <th className="px-6 py-4 text-sm font-semibold">
              Price
            </th>

            <th className="px-6 py-4 text-sm font-semibold">
              Rating
            </th>

            <th className="px-6 py-4 text-sm font-semibold">
              Stock
            </th>

            <th className="px-6 py-4 text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b last:border-b-0"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />

                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium hover:underline"
                  >
                    {product.title}
                  </Link>
                </div>
              </td>

              <td className="px-6 py-4 capitalize">
                {product.category}
              </td>

              <td className="px-6 py-4">
                ${product.price}
              </td>

              <td className="px-6 py-4">
                ⭐ {product.rating}
              </td>

              <td className="px-6 py-4">
                {product.stock}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(product.id)}
                    className="rounded-lg border px-3 py-2 text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}