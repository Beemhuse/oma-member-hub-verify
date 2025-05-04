import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import api from '@/lib/axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface UseApiQueryOptions<T> {
  url: string;
  shouldFetch?: boolean;
}

interface UseApiMutationOptions<TResponse, TRequest> {
  method: HttpMethod;
  url: string;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: Error) => void;
}

export function useApiQuery<TResponse>({
  url,
  shouldFetch = true,
}: UseApiQueryOptions<TResponse>) {
  const { data, error, isLoading, mutate } = useSWR<TResponse>(
    shouldFetch ? url : null,
    async (url: string) => {
      const response = await api.get<TResponse>(url);
      return response.data;
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

export function useApiMutation<TResponse, TRequest>({
  method,
  url,
  onSuccess,
  onError,
}: UseApiMutationOptions<TResponse, TRequest>) {
  const { trigger, isMutating } = useSWRMutation<TResponse, Error, string, TRequest>(
    url,
    async (_url, { arg }) => {
      const response = await api.request<TResponse>({
        url,
        method,
        data: arg,
      });
      return response.data;
    },
    {
      onSuccess,
      onError,
    }
  );

  return {
    mutate: trigger,
    isMutating,
  };
}
