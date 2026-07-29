import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 1000 * 60 * 10,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});
