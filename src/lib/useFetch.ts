import { useState, useEffect, useRef } from 'react';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: unknown; ts: number }>();

export function useFetch<T>(url: string): { data: T | null; loading: boolean; error: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const cached = cache.get(url);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setData(cached.data as T);
      setLoading(false);
      return () => { mountedRef.current = false; };
    }

    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        cache.set(url, { data: d, ts: Date.now() });
        if (mountedRef.current) { setData(d); setLoading(false); }
      })
      .catch(() => { if (mountedRef.current) { setError(true); setLoading(false); } });

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}
