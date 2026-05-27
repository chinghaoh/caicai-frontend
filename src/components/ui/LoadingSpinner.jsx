export default function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-border rounded-full border-t-green animate-spin" />
      </div>
    )
  }