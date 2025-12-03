import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const customPingBaseQuery = async ({
  url,
}: {
  url: string;
}): Promise<{ data: number } | { error: FetchBaseQueryError }> => {
  try {
    const apiUrl = `/api/radar/latency?target=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl, {
      cache: 'no-store',
    });

    const json: any = await res.json();
    const latency = typeof json?.latencyMs === 'number' ? json.latencyMs : -1;

    // Even if the response is not OK, if we got a latency measurement, return it
    // This allows us to track latency even for failed requests
    if (latency >= 0) {
      return { data: Math.round(latency) };
    }

    // If no valid latency was returned, return an error
    return {
      error: {
        status: res.status || 'CUSTOM_ERROR',
        data: json?.error || 'Latency value missing or invalid',
      },
    };
  } catch (error: any) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: error.message || 'Ping failed',
      },
    };
  }
};

export const networkApi = createApi({
  reducerPath: 'networkApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    pingNode: builder.query<number, string>({
      queryFn: async (url) => customPingBaseQuery({ url }),
      keepUnusedDataFor: 5, 
    }),
  }),
});

export const { useLazyPingNodeQuery } = networkApi;