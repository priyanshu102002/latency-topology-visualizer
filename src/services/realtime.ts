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