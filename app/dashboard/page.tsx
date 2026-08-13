import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!profile) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Welcome{profile.name ? `, ${profile.name}` : ""}</h1>

      <p>{profile.email}</p>

      <p>{profile.branch ? profile.branch : "Branch not set"}</p>

      <Link href="/experience/new">Write an experience</Link>

      <section>
        <h2>Your experiences</h2>

        <p>You haven't submitted any experiences yet.</p>
      </section>
    </main>
  );
}
