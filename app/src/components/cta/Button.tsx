import classNames from "classnames"

export function Button({
  className,
  disabled,
  loading,
  text,
  type,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  loading?: boolean
  text: string
}) {
  return (
    <button
      className={classNames(
        "flex items-center justify-center gap-3 rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-colors enabled:hover:bg-blue-700",
        className,
      )}
      disabled={disabled || loading}
      type={type ?? "button"}
      {...(loading && {"aria-busy": true})}
      {...props}
    >
      {loading && (
        <span
          aria-busy="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"
          role="alert"
        />
      )}
      {text}
    </button>
  )
}
