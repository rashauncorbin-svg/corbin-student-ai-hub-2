const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra }
});

const headers = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "permissions-policy": "camera=(), microphone=(), geolocation=()"
};

function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(v => v.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : null;
}

function withCors(response, origin) {
  if (!origin) return response;
  const h = new Headers(response.headers);
  h.set("access-control-allow-origin", origin);
  h.set("access-control-allow-methods", "GET, POST, OPTIONS");
  h.set("access-control-allow-headers", "Content-Type, Authorization");
  h.set("vary", "Origin");
  return new Response(response.body, { status: response.status, headers: h });
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env);
    const requestOrigin = request.headers.get("Origin");
    if (requestOrigin && !origin) return json({ error: "ORIGIN_NOT_ALLOWED" }, 403, headers);
    if (request.method === "OPTIONS") {
      if (!origin) return new Response(null, { status: 204, headers });
      return new Response(null, { status: 204, headers: {
        ...headers,
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "Content-Type, Authorization",
        "access-control-max-age": "86400",
        "vary": "Origin"
      }});
    }

    const url = new URL(request.url);
    let response;
    if (url.pathname === "/api/health" && request.method === "GET") {
      response = json({
        service: "corbin-student-ai-hub-api",
        status: "online",
        environment: env.ENVIRONMENT || "unconfigured",
        database: Boolean(env.DB),
        authentication: "not-configured"
      }, 200, headers);
    } else if (url.pathname === "/api/courses" && request.method === "GET") {
      response = json({ courses: [
        { id: "us-history-standard", name: "U.S. History", level: "Standard", subject: "Social Studies" },
        { id: "us-history-honors", name: "U.S. History", level: "Honors", subject: "Social Studies" },
        { id: "psychology", name: "Psychology", level: "Course", subject: "Social Science" },
        { id: "sociology", name: "Sociology", level: "Course", subject: "Social Science" }
      ] }, 200, { ...headers, "cache-control": "public, max-age=300" });
    } else if (url.pathname.startsWith("/api/")) {
      // Deliberately fail closed until an identity provider and authorization
      // policy are configured and tested. Never accept a class code as identity.
      response = json({
        error: "AUTHENTICATION_NOT_CONFIGURED",
        message: "Protected student and teacher workflows are disabled until authentication is configured."
      }, 503, headers);
    } else {
      response = json({ error: "NOT_FOUND" }, 404, headers);
    }
    return withCors(response, origin);
  }
};
