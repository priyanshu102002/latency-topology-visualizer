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

    if (!res.ok) {
      return {
        error: {
          status: res.status,
          data: 'Latency API request failed',
        },
      };
    }

    const json: any = await res.json();
    const latency = typeof json?.latencyMs === 'number' ? json.latencyMs : -1;

    if (latency < 0) {
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: 'Latency value missing or invalid',
        },
      };
    }

    return { data: Math.round(latency) };
  } catch {
    return { error: { status: 'CUSTOM_ERROR', error: 'Ping failed' } };
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