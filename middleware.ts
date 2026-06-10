import { NextRequest, NextResponse } from "next/server";

// CSP-only middleware. No auth/redirect/guard logic here (protected routes keep
// their per-page auth() guards). A fresh nonce is generated per request and set
// on the request CSP header so Next injects it into its own bootstrap scripts;
// strict-dynamic then lets those scripts load further chunks.
// The other four headers (X-Frame-Options/X-Content-Type-Options/HSTS/
// Referrer-Policy) are attached in next.config.mjs headers() so they also cover
// static assets and API responses, which this middleware's matcher skips.
export function middleware(request: NextRequest) {
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
