export default function Button({
    children,
    variant = 'primary',
    type = 'button',
    fullWidth = false,
    disabled = false,
    loading = false,
    onClick,
  }) {
    const base = 'rounded-lg px-4 py-2 font-semibold text-base transition-opacity flex items-center justify-center gap-2 cursor-pointer'
  
    const variants = {
      primary:   'bg-green text-bg-page hover:opacity-90',
      secondary: 'bg-transparent text-text-primary border border-border hover:border-border-light',
      danger:    'bg-transparent text-red border border-red hover:opacity-80',
    }
  
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          ${base}
          ${variants[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : children}
      </button>
    )
  }