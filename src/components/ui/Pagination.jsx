export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null
  
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg text-sm bg-bg-input border border-border text-text-secondary disabled:opacity-40 hover:border-border-light disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-text-muted px-2">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg text-sm bg-bg-input border border-border text-text-secondary disabled:opacity-40 hover:border-border-light disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    )
  }