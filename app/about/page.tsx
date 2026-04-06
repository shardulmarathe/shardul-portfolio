import { redirect } from "next/navigation";

/** About lives on the homepage; keep URL working for bookmarks and old links. */
export default function AboutPage() {
  redirect("/");
}
