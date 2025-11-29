import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Custom ping implementation wrapped in queryFn
const customPingBaseQuery = async ({ url }: { url: string }): Promise<{ data: number } | { error: FetchBaseQueryError }> => {
  const start = performance.now();
  try {
    const targetUrl = new URL(url);
    targetUrl.searchParams.append('_t', Date.now().toString());
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);

    await fetch(targetUrl.toString(), { 
      mode: 'no-cors', 
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(id);
    const end = performance.now();
    return { data: Math.round(end - start) };
  } catch (e) {
    return { error: { status: 'CUSTOM_ERROR', error: 'Ping failed' } };
  }
};

export const networkApi = createApi({
  reducerPath: 'networkApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), // Placeholder, unused due to queryFn
  endpoints: (builder) => ({
    pingNode: builder.query<number, string>({
      queryFn: async (url) => customPingBaseQuery({ url }),
      // Don't cache pings for too long, we want freshness
      keepUnusedDataFor: 5, 
    }),
  }),
});

export const { usePingNodeQuery, useLazyPingNodeQuery } = networkApi;