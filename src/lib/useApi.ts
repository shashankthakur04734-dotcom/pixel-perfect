import { useCallback, useEffect, useState } from "react";
import { api, errMsg } from "./api";

export function useApi<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    if (!url) return;
    setLoading(true); setError(null);
    try { const r = await api.get<T>(url); setData(r.data); }
    catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  }, [url]);
  useEffect(() => { void load(); }, [load]);
  return { data, error, loading, reload: load, setData };
}
