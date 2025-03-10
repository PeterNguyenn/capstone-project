import { useState } from 'react';
import { ApiError } from '../utils/error-handler';

interface UseApiMutationResult<T, P> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  mutate: (params: P) => Promise<T>;
  reset: () => void;
}

export function useApiMutation<T, P>(
  mutationFn: (params: P) => Promise<T>
): UseApiMutationResult<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = async (params: P): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(params);
      setData(result);
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { data, loading, error, mutate, reset };
}