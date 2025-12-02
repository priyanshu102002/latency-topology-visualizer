export const pingNode = async (url: string): Promise<number> => {
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
    return Math.round(end - start);
  } catch (e) {
    return -1;
  }
};

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
