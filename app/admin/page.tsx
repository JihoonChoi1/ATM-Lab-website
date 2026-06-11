import { redirect } from "next/navigation";

// /admin itself has no content until the 7-9 dashboard lands — without this
// page the URL renders the global 404 outside the admin shell, which reads as
// breakage. Bounce to the first real admin page instead.
export default function AdminIndexPage() {
  redirect("/admin/activity");
}
