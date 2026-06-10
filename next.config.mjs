/** @type {import('next').NextConfig} */

// CSP is attached in middleware.ts (needs a per-request nonce). These four
// static headers live here so they cover every response, including static
// assets and API routes that the middleware matcher skips. No header is set in
// both places, so nothing is emitted twice.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // HSTS: only honored over HTTPS (ignored on http://localhost). 2 years, no
  // includeSubDomains/preload — single host atmlab.ajou.ac.kr; revisit in Phase 10.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
