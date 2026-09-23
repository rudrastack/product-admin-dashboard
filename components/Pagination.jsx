export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  return (
    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 text-sm">
        <span>Page size:</span>

        <select
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(Number(event.target.value))
          }
          className="rounded-lg border bg-white px-3 py-2"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg border bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`rounded-lg px-3 py-2 text-sm ${
              page === currentPage
                ? "bg-black text-white"
                : "border bg-white"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg border bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}