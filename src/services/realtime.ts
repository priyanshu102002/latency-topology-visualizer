
/**
 * Measures the Round Trip Time (RTT) to a given URL.
 * Uses mode: 'no-cors' to allow fetching opaque responses from public APIs
 * without CORS errors blocking the network request completely.
 */
export const pingNode = async (url: string): Promise<number> => {
  const start = performance.now();
  try {
    // We append a random query param to prevent caching
    const targetUrl = new URL(url);
    targetUrl.searchParams.append('_t', Date.now().toString());
    
    // Abort controller to timeout requests that hang
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);

    await fetch(targetUrl.toString(), { 
      mode: 'no-cors', 
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(id);
    const end = performance.now();
    return Math.round(end - start);
  } catch (e) {
    // If it fails or times out, return -1 to indicate unreachable/error
    return -1;
  }
};

/**
 * Fetches real-time Bitcoin price from Binance public API
 */
export const getBitcoinPrice = async (): Promise<string | null> => {
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    if (res.ok) {
      const data = await res.json();
      return parseFloat(data.price).toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2
      });
    }
    return null;
  } catch (e) {
    console.error("Failed to fetch BTC price", e);
    return null;
  }
};
