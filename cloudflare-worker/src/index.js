const YOUVERSION_API = "https://api.youversion.com";
const ALLOWED_VERSIONS = new Set(["86", "111"]);

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Accept",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function jsonError(message, status, origin) {
  return new Response(JSON.stringify({error:message}), {
    status,
    headers:{"Content-Type":"application/json; charset=utf-8", ...corsHeaders(origin)}
  });
}

function isAllowedPath(pathname) {
  const version = pathname.match(/^\/v1\/bibles\/(\d+)(?:\/|$)/)?.[1]
    || pathname.match(/^\/v1\/bibles\/(\d+)$/)?.[1];
  if (!version || !ALLOWED_VERSIONS.has(version)) return false;
  return [
    /^\/v1\/bibles\/(?:86|111)$/,
    /^\/v1\/bibles\/(?:86|111)\/passages\/[1-3]?[A-Z]{2,3}\.\d+(?:\.\d+(?:-[1-3]?[A-Z]{2,3}\.\d+\.\d+|-[1-3]?[A-Z]{2,3}\.\d+|-[0-9]+)?)?$/,
    /^\/v1\/bibles\/(?:86|111)\/books\/[1-3]?[A-Z]{2,3}\/chapters\/\d+\/verses$/
  ].some(pattern => pattern.test(pathname));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://hunsuk1977.github.io";

    if (origin !== allowedOrigin) return jsonError("Origin not allowed", 403, allowedOrigin);
    if (request.method === "OPTIONS") return new Response(null, {status:204, headers:corsHeaders(origin)});
    if (request.method !== "GET") return jsonError("Method not allowed", 405, origin);
    if (!env.YV_APP_KEY) return jsonError("Server is not configured", 503, origin);
    if (!isAllowedPath(url.pathname)) return jsonError("Bible request not allowed", 400, origin);

    const upstream = new URL(url.pathname, YOUVERSION_API);
    if (url.pathname.includes("/passages/")) {
      upstream.searchParams.set("format", "html");
      upstream.searchParams.set("include_headings", "true");
      upstream.searchParams.set("include_notes", "true");
    }

    const response = await fetch(upstream, {
      headers:{"Accept":"application/json", "X-YVP-App-Key":env.YV_APP_KEY}
    });
    const headers = new Headers(corsHeaders(origin));
    headers.set("Content-Type", response.headers.get("Content-Type") || "application/json; charset=utf-8");
    headers.set("Cache-Control", "private, no-store");
    return new Response(response.body, {status:response.status, headers});
  }
};
