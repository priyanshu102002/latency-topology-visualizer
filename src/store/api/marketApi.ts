import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface BinanceTicker {
  symbol: string;
  price: string;
}

export const marketApi = createApi({
  reducerPath: 'marketApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.binance.com/api/v3/' }),
  endpoints: (builder) => ({
    getBtcPrice: builder.query<string, void>({
      query: () => 'ticker/price?symbol=BTCUSDT',
      // Transform response to formatted currency string
      transformResponse: (response: BinanceTicker) => {
        return parseFloat(response.price).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        });
      },
    }),
  }),
});

export const { useGetBtcPriceQuery } = marketApi;