import { useState, useCallback } from 'react';
import type { ApiResponse } from '../types';

interface UseApiOptions {
  immediate?: boolean;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  _options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiFunction();
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
