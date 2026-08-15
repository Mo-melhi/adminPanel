import { createContext, useContext, useEffect, useState } from "react"

/**
 * Lightweight page-meta channel so each page can set the header title and
 * breadcrumb without prop-drilling. Pages call `usePageMeta(title, crumbs)`.
 */
const LayoutMetaContext = createContext(null)

export function LayoutMetaProvider({ children }) {
  const [meta, setMeta] = useState({ title: "Dashboard", breadcrumb: [] })
  return <LayoutMetaContext.Provider value={{ meta, setMeta }}>{children}</LayoutMetaContext.Provider>
}

export function useLayoutMeta() {
    const ctx = useContext(LayoutMetaContext)

    return {
        ...(ctx?.meta || { title: "", breadcrumb: [] }),
        setMeta: ctx?.setMeta || (() => {})
    }
}

/** Call from a page to set the header title + breadcrumb. */
export function usePageMeta(title, breadcrumb = []) {
  const ctx = useContext(LayoutMetaContext)
  const key = JSON.stringify({ title, breadcrumb })
  useEffect(() => {
    ctx?.setMeta({ title, breadcrumb })
    document.title = title ? `${title} · Turbo Travel Admin` : "Turbo Travel Admin"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}
