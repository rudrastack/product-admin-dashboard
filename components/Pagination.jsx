export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 text-sm text-[#667085]">
        <span>Rows per page</span>

        <select
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(Number(event.target.value))
          }
          className="rounded-md border border-[var(--line)] bg-white px-3 py-2 font-semibold text-[#4f4d48] outline-none transition-shadow focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm font-medium text-[#5f5d58] transition-colors hover:bg-[#f8f7f4] disabled:cursor-not-allowed disabled:opacity-40"
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
                ? "bg-[var(--brand)] text-white shadow-[0_4px_10px_rgba(25,25,24,0.14)]"
                : "border border-[var(--line)] bg-white text-[#5f5d58] hover:bg-[#f8f7f4]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm font-medium text-[#5f5d58] transition-colors hover:bg-[#f8f7f4] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}