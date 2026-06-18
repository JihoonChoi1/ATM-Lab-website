import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// AUTH_URL (siteUrl) is injected at runtime, so render per-request to emit the
// deploy's real host in the Sitemap line instead of the build-time fallback.
export const dynamic = "force-dynamic";

// Same rules on both deploys. The demo is kept out of search via the noindex
// meta tag (see app/layout.tsx), not via Disallow:/ here — blocking the crawl
// would stop Google from ever reading that noindex. /login has no SEO value.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/login"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
