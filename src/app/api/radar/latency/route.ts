import { NextRequest, NextResponse } from "next/server";
import { pingNode } from "@/services/realtime";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("target");

  if (!target) {
    return NextResponse.json(
      { error: "Missing required query parameter: target" },
      { status: 400 }
    );
  }

  const decodedTarget = decodeURIComponent(target);

  let host = decodedTarget;
  try {
    host = new URL(decodedTarget).hostname;
  } catch (err) {
    console.log(err);
  }

  const apiKey = process.env.APIVOID_API_KEY;

  if (apiKey) {
    try {
      const apiUrl = `https://endpoint.apivoid.com/ping/v1/pay-as-you-go/?key=${apiKey}&host=${encodeURIComponent(
        host
      )}`;

      const res = await fetch(apiUrl, {
        // Server-side fetch; no need for special CORS handling
        cache: "no-store",
      });

      if (res.ok) {
        const data: any = await res.json();

        const candidateValues: unknown[] = [
          data?.data?.general?.latency?.avg,
          data?.data?.latency?.average,
          data?.data?.average_rtt,
          data?.data?.rtt?.avg,
        ];

        const latencyFromApi = candidateValues.find(
          (v) => typeof v === "number" && !Number.isNaN(v)
        ) as number | undefined;

        if (typeof latencyFromApi === "number") {
          return NextResponse.json({
            latencyMs: Math.round(latencyFromApi),
            source: "apivoid",
          });
        }
      }
    } catch {
      // Silently ignore and use local ping fallback below
    }
  }

  // 2. Fallback: measure RTT directly from this server to the target URL
  try {
    const latency = await pingNode(decodedTarget);

    if (latency < 0) {
      return NextResponse.json(
        {
          latencyMs: -1,
          source: apiKey ? "fallback_ping_failed" : "local_ping_failed",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      latencyMs: latency,
      source: apiKey ? "fallback_ping" : "local_ping",
    });
  } catch {
    return NextResponse.json(
      {
        latencyMs: -1,
        source: apiKey ? "fallback_ping_failed" : "local_ping_failed",
      },
      { status: 502 }
    );
  }
}
