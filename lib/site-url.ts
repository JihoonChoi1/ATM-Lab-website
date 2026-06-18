// Per-deploy canonical origin. Reuses AUTH_URL (Auth.js requires it on every
// deploy) so there is no extra env var; the localhost fallback only applies to
// local dev. Single source for metadataBase (layout) and the absolute URLs in
// robots.ts / sitemap.ts. AUTH_URL is injected at runtime, so robots/sitemap
// must be force-dynamic to read the deploy's real host instead of this fallback.
export const siteUrl = process.env.AUTH_URL ?? "http://localhost:3000";
