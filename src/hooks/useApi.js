import { useCallback, useEffect, useState } from "react"

/**
 * Generic data-fetching hook that provides consistent loading / error / data
 * state plus a `refetch` action. Pages pass an api function; they never call
 * Axios directly.
 *
 *   const { data, loading, error, refetch } = useApi(() => customerApi.list())
 */
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
    } catch (err) {
      setError(normalizeError(err))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    run()
  }, [run])

  return { data, loading, error, refetch: run, setData }
}

export function normalizeError(err) {
  if (err?.response?.data?.message) return err.response.data.message
  if (err?.response?.status) return `Request failed (${err.response.status}). Please try again.`
  if (err?.message === "Network Error") return "Cannot reach the server. Check your connection and API URL."
  return err?.message || "Something went wrong. Please try again."
}
