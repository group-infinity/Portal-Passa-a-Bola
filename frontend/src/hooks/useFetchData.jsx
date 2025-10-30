import { useState, useEffect, useCallback } from "react";

export function useFetchData(serviceFunction, params = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await serviceFunction(params);
      setData(result);
    } catch (err) {
      setError(err);
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceFunction, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}