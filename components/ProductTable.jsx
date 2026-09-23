import Link from "next/link";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(25,25,24,0.035)] md:block">
      <table className="w-full text-left">
        <thead className="border-b border-[var(--line)] bg-[#fbfaf8]">
          <tr>
            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
              Product
            </th>

            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
              Category
            </th>

            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
              Price
            </th>

            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
              Rating
            </th>

            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
              Stock
            </th>

            <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-[var(--line)] transition-colors last:border-b-0 hover:bg-[#fcfbf9]"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-12 w-12 rounded-lg border border-[var(--line)] bg-[#f4f3ef] object-cover"
                  />

                  <Link
                    href={`/products/${product.id}`}
                    className="max-w-[240px] font-semibold text-[#191918] transition-colors hover:underline"
                  >
                    {product.title}
                  </Link>
                </div>
              </td>

              <td className="px-6 py-5">
                <span className="inline-flex rounded-md bg-[#f1f0ed] px-2.5 py-1 text-xs font-semibold capitalize text-[#5f5d58]">
                  {product.category}
                </span>
              </td>

              <td className="px-6 py-5 font-semibold text-[#191918]">
                ${Number(product.price).toFixed(2)}
              </td>

              <td className="px-6 py-5">
                <span className="font-medium text-[#4f4d48]">
                  <span className="mr-1 text-[#8d887c]">*</span>
                  {product.rating}
                </span>
              </td>

              <td className="px-6 py-5">
                <span className={product.stock < 10 ? "font-semibold text-[#9b4540]" : "text-[#5f5d58]"}>
                  {product.stock} units
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-5">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-md border border-[var(--line)] px-3 py-2 text-xs font-semibold text-[#4f4d48] transition-colors hover:border-[#bcb9b2] hover:bg-[#f8f7f4] hover:text-[#191918]"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(product.id)}
                    className="rounded-md border border-[#ead4d1] px-3 py-2 text-xs font-semibold text-[#9b4540] transition-colors hover:bg-[#fff8f7]"
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