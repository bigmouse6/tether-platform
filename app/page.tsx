import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // və ya /auth
}
