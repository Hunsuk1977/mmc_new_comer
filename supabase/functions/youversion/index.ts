const YOUVERSION_API = "https://api.youversion.com";
const ALLOWED_ORIGIN = "https://hunsuk1977.github.io";
const ALLOWED_VERSIONS = new Set(["86", "111"]);

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function jsonError(message: string, status: number, origin: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  });
}

function requestedApiPath(url: URL) {
  const marker = "/youversion";
  const markerIndex = url.pathname.indexOf(marker);
  return markerIndex < 0 ? "" : url.pathname.slice(markerIndex + marker.length);
}

function isAllowedPath(pathname: string) {
  const version = pathname.match(/^\/v1\/bibles\/(\d+)(?:\/|$)/)?.[1]
    || pathname.match(/^\/v1\/bibles\/(\d+)$/)?.[1];
  if (!version || !ALLOWED_VERSIONS.has(version)) return false;
  return [
    /^\/v1\/bibles\/(?:86|111)$/,
    /^\/v1\/bibles\/(?:86|111)\/passages\/[1-3]?[A-Z]{2,3}\.\d+(?:\.\d+(?:-[1-3]?[A-Z]{2,3}\.\d+\.\d+|-[1-3]?[A-Z]{2,3}\.\d+|-[0-9]+)?)?$/,
    /^\/v1\/bibles\/(?:86|111)\/books\/[1-3]?[A-Z]{2,3}\/chapters\/\d+\/verses$/,
  ].some((pattern) => pattern.test(pathname));
}

Deno.serve(async (request) => {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin") || "";

  if (origin !== ALLOWED_ORIGIN) return jsonError("Origin not allowed", 403, ALLOWED_ORIGIN);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "GET") return jsonError("Method not allowed", 405, origin);

  const appKey = Deno.env.get("YOUVERSION_APP_KEY");
  if (!appKey) return jsonError("Server is not configured", 503, origin);

  const apiPath = requestedApiPath(url);
  if (!isAllowedPath(apiPath)) return jsonError("Bible request not allowed", 400, origin);

  const upstream = new URL(apiPath, YOUVERSION_API);
  if (apiPath.includes("/passages/")) {
    upstream.searchParams.set("format", "html");
    upstream.searchParams.set("include_headings", "true");
    upstream.searchParams.set("include_notes", "true");
  }

  const response = await fetch(upstream, {
    headers: { "Accept": "application/json", "X-YVP-App-Key": appKey },
  });
  const headers = new Headers(corsHeaders(origin));
  headers.set("Content-Type", response.headers.get("Content-Type") || "application/json; charset=utf-8");
  headers.set("Cache-Control", "private, no-store");
  return new Response(response.body, { status: response.status, headers });
});
