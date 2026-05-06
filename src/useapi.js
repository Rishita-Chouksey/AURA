/**
 * useAPI — generic hook for any async API function.
 *
 * Usage:
 *   const { loading, error, data, request } = useAPI();
 *   const result = await request(auraAPI.analyzeText, "patient text");
 */
import { useState, useCallback } from "react";

export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [data,    setData]    = useState(null);

  const request = useCallback(async (apiFn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { loading, error, data, request, reset };
}