import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function MyExperiencesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const experiences = await prisma.experience.findMany({
    where: {
      authorId: user.id,
    },
    include: {
      company: true,
      rounds: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <main>
      <header>
        <h1>My Experiences</h1>

        <Link href="/experiences/new">Share an Experience</Link>
      </header>

      {experiences.length === 0 ? (
        <section>
          <p>You haven't shared any interview experiences yet.</p>

          <Link href="/experiences/new">Share your first experience</Link>
        </section>
      ) : (
        <section>
          {experiences.map((experience) => (
            <article key={experience.id}>
              <h2>{experience.company.name}</h2>

              <p>
                {experience.degree} · {experience.roleTitle}
              </p>

              <p>Graduation Year: {experience.graduationYear}</p>

              <p>
                {experience.rounds.length} {experience.rounds.length === 1 ? "round" : "rounds"}
              </p>

              <p>Status: {experience.status}</p>

              {experience.status === "draft" && <Link href={`/experience/${experience.id}/edit`}>Continue Editing</Link>}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
