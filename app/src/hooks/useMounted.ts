import React from "react"

export function useMounted(callback: () => void) {
  const mounted = React.useRef(false)
  React.useEffect(() => {
    /* istanbul ignore next */
    if (!mounted.current) {
      mounted.current = true
      callback()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
