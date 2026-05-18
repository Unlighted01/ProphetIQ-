/**
 * ProphetIQ API client
 * Base URL is set via NEXT_PUBLIC_API_URL environment variable in Vercel.
 * Example: https://prophet-iq-production.railway.app
 */

const RAW_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
const API_BASE_URL = `${RAW_BASE}/api/v1`;

// ─── Friendly error messages ───────────────────────────────────────────────
function humanizeError(status: number, detail?: any): string {
  if (!navigator.onLine) return "You appear to be offline. Check your connection.";
  if (status === 0 || status === undefined)
    return "Can't reach the server. It may be starting up — try again in a moment.";
  if (status === 422) {
    if (Array.isArray(detail))
      return "Invalid input: " + detail.map((e: any) => `${e.loc?.slice(-1)[0]}: ${e.msg}`).join(", ");
    return "Please check your input values and try again.";
  }
  if (status === 429) return "Too many requests. Please wait a moment before trying again.";
  if (status === 500) return "Our prediction model hit an issue. Please try different inputs.";
  if (status === 503) return "The server is temporarily unavailable. Please try again shortly.";
  return detail || `Unexpected error (${status}). Please try again.`;
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    // Got HTML back (e.g., a 404/502 page) — server is not ready
    throw new Error("Can't reach the server. It may be starting up — try again in a moment.");
  }
  return res.json();
}

// ─── Endpoints ──────────────────────────────────────────────────────────────

export async function predictPrice(features: any) {
  const response = await fetch(`${API_BASE_URL}/predict/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(humanizeError(response.status, data?.detail));
  }

  return {
    ...data,
    predicted_price: data.predicted_price_php, // alias for legacy components
  };
}

export async function getAIAdvice(features: any, prediction: any) {
  const response = await fetch(`${API_BASE_URL}/advisor/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features, prediction }),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(humanizeError(response.status, data?.detail));
  }

  return data;
}

export async function getInvestmentMetrics(price: number) {
  const response = await fetch(`${API_BASE_URL}/investment/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ predicted_price_php: price }),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(humanizeError(response.status, data?.detail));
  }

  return data;
}

export async function checkHealth() {
  try {
    const response = await fetch(`${RAW_BASE}/health`, {
      // Short timeout — don't block the page load if Railway is sleeping
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { status: "offline" };
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return { status: "offline" };
    return response.json();
  } catch {
    return { status: "offline" };
  }
}
