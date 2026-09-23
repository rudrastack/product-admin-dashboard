export default function ProductTable({ products }) {
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

                                    <span className="font-medium">
                                        {product.title}
                                    </span>
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
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}