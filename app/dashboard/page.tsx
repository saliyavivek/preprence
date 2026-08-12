import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard</h1>

      <p>You're logged in.</p>

      <p>Email: {user.email}</p>

      <p>User ID: {user.id}</p>
    </main>
  );
}
