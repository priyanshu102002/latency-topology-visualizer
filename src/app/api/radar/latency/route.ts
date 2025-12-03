import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const target = searchParams.get('target');

  if (!target) {
    return NextResponse.json(
      { error: 'Target URL is required', latencyMs: -1 },
      { status: 400 }
    );
  }

  // Validate URL
  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    return NextResponse.json(
      { error: 'Invalid URL format', latencyMs: -1 },
      { status: 400 }
    );
  }

  // Only allow HTTP/HTTPS protocols
  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    return NextResponse.json(
      { error: 'Only HTTP and HTTPS protocols are allowed', latencyMs: -1 },
      { status: 400 }
    );
  }

  // Measure latency
  const startTime = Date.now();
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(target, {
      method: 'HEAD', // Use HEAD to avoid downloading full response
      signal: controller.signal,
      headers: {
        'User-Agent': 'Latency-Topology-Visualizer/1.0',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);
    const endTime = Date.now();
    const latencyMs = Math.round(endTime - startTime);

    // Return latency even if the response status is not OK
    // This allows us to measure latency to endpoints that might return errors
    return NextResponse.json({
      latencyMs,
      status: response.status,
      ok: response.ok,
    });
  } catch (fetchError: any) {
    clearTimeout(timeoutId);
    
    const endTime = Date.now();
    const latencyMs = Math.round(endTime - startTime);
    
    // If it's an abort (timeout), return the timeout latency
    if (fetchError.name === 'AbortError') {
      return NextResponse.json({
        latencyMs,
        status: 408,
        ok: false,
        error: 'Request timeout',
      });
    }

    // For other fetch errors (network errors, DNS failures, etc.)
    // Return the latency we measured up to the point of failure
    // This helps identify slow or unreachable endpoints
    return NextResponse.json({
      latencyMs: latencyMs > 0 ? latencyMs : -1,
      status: 500,
      ok: false,
      error: fetchError.message || 'Request failed',
    });
  }
}

