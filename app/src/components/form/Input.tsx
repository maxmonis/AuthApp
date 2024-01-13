import classNames from "classnames"

export function Input({
  className,
  error,
  label,
  name,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label: string
}) {
  return (
    <div {...(className && {className})}>
      <label className="ml-1 text-sm" htmlFor={name}>
        {label}
      </label>
      <input
        className={classNames(
          "w-full rounded-lg border bg-inherit px-3 py-2 transition-colors",
          error ? "border-red-600 dark:border-red-500" : "border-slate-700",
        )}
        id={name}
        {...{name}}
        {...props}
      />
      {error && (
        <p className="mx-1 text-sm leading-snug text-red-600 dark:text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
