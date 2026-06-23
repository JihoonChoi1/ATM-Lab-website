import { NextRequest, NextResponse } from "next/server";

// CSP + an optimistic /admin edge guard. The authoritative auth check stays
// per-page (requireAdmin); the guard here only redirects cookie-less requests to
// /login early so admin content never flashes before the login screen (see the
// inline note). A fresh nonce is generated per request and set on the request CSP
// header so Next injects it into its own bootstrap scripts; strict-dynamic then
// lets those scripts load further chunks.
// The other four headers (X-Frame-Options/X-Content-Type-Options/HSTS/
// Referrer-Policy) are attached in next.config.mjs headers() so they also cover
// static assets and API responses, which this middleware's matcher skips.
export function middleware(request: NextRequest) {
  // Edge guard for /admin: redirect unauthenticated requests to /login *before*
  // any admin content (freshly rendered or client-router-cached) reaches the
  // browser, so protected content never flashes on the way to the login screen.
  // Optimistic session-cookie presence check only — the authoritative check (JWT
  // signature + expiry) stays in each page's requireAdmin (lib/auth/guard.ts);
  // `auth` can't run here at the edge because it imports prisma via authenticate().
  // Cookie names are Auth.js v5 defaults (auth.ts sets no custom `cookies`):
  // `__Secure-` prefix when the cookie is Secure (https), plain name in dev.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const hasSession =
      request.cookies.has("authjs.session-token") ||
      request.cookies.has("__Secure-authjs.session-token");
    if (!hasSession) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = "";
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const isDev = process.env.NODE_ENV !== "production";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // prod: strict nonce + strict-dynamic. dev: host-based allowlist — Turbopack/HMR
  // injects some chunk scripts without a nonce, which strict-dynamic would block.
  // The relaxation is local-dev only; the deployed (prod) policy stays strict.
  const scriptSrc = isDev
    ? `script-src 'self' 'unsafe-inline' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const csp = [
    `default-src 'self'`,
    scriptSrc,
    `style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com`,
    `font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com`,
    `img-src 'self' data:`,
    `connect-src 'self'${isDev ? " ws:" : ""}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `frame-src 'none'`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Skip static assets, image optimization, favicon, API, and prefetches —
    // only HTML document responses need the CSP/nonce.
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
