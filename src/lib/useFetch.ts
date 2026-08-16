import { useState, useEffect, useRef } from 'react';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: unknown; ts: number }>();
const inflight = new Map<string, Promise<unknown>>();

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

    let promise = inflight.get(url);
    if (!promise) {
      const controller = new AbortController();
      promise = fetch(url, { signal: controller.signal })
        .then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then(d => {
          cache.set(url, { data: d, ts: Date.now() });
          inflight.delete(url);
          return d;
        })
        .catch(e => {
          inflight.delete(url);
          throw e;
        });
      inflight.set(url, promise);
    }

    promise
      .then(d => {
        if (mountedRef.current) { setData(d as T); setLoading(false); }
      })
      .catch(() => {
        if (mountedRef.current) { setError(true); setLoading(false); }
      });

    return () => {
      mountedRef.current = false;
    };
  }, [url]);

  return { data, loading, error };
}
