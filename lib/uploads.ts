// Phase 7-8: single source of truth for the upload kill-switch. Unset (school
// server, zero-config) → uploads on; the Vercel demo sets UPLOADS_ENABLED="0"
// because its serverless filesystem can't persist public/uploads writes. Read
// at request time on the server — pages read it to hide the upload UI, and the
// upload action re-checks it as the real gate (hiding the UI is not a security
// boundary). Not NEXT_PUBLIC: keeping it server-only avoids baking the value
// into the client bundle and matches the project's no-NEXT_PUBLIC convention.
export function uploadsEnabled(): boolean {
  return process.env.UPLOADS_ENABLED !== "0";
}
