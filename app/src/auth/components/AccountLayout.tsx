export function AccountLayout({
  children,
  title,
}: React.PropsWithChildren<{title: string}>) {
  return (
    <div className="flex justify-center px-6">
      <div className="mb-40 mt-10 flex max-h-min w-full max-w-xs flex-col gap-3 rounded-md border border-slate-700 bg-white p-6 dark:bg-black">
        <div className="mx-auto flex items-center gap-2">
          <img alt="AuthApp logo" className="h-6 w-6" src="/logo192.png" />
          <h1 className="text-2xl">AuthApp</h1>
        </div>
        <h2 className="text-center text-xl font-bold">{title}</h2>
        {children}
      </div>
    </div>
  )
}
