import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, ChevronRightIcon, GraduationCapIcon } from "@hugeicons/core-free-icons";
import { CompanyMarkMedium } from "@/components/CompanyMark";

export function SkillRoleExperienceRowCard({ experience }: { experience: any }) {
  return (
    <Link
      href={`/experiences/${experience.id}`}
      className="group rounded-lg border border-border bg-white/60 transition hover:border-primary/30 hover:shadow-xs"
    >
      <article className="flex flex-col sm:flex-row gap-5 sm:gap-7 p-4 sm:p-5">
        <div className="flex flex-1 items-start sm:items-center gap-3 min-w-0">
          <CompanyMarkMedium company={experience.company} />
          <div className="min-w-0 flex flex-col sm:flex-row flex-1 gap-2 sm:gap-12">
            <div>
              <h3 className="truncate text-md font-semibold group-hover:text-primary">{experience.company.name}</h3>
              {/* Display the role fetched with the experience */}
              <p className="mt-0.5 text-sm text-muted-foreground">{experience.roleName}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:gap-2">
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={14}
                    strokeWidth={2}
                  />
                  <span>{experience.timing}</span>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden mt-1 text-xs text-gray-200 sm:inline"
                >
                  |
                </span>
                <div className="mt-1 flex items-center self-start gap-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon
                      className="w-4 h-4"
                      size="100%"
                      icon={GraduationCapIcon}
                    />
                    {experience.degree}
                  </span>
                  <span>·</span>
                  <span>{experience.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-7 flex justify-between flex-1">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Interview Rounds</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {experience.rounds.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-md capitalize border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Skills asked</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {experience.skills.length > 0 ? (
                  experience.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground font-semibold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No skills recorded</span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden shrink-0 items-center justify-center text-muted-foreground group-hover:text-primary sm:flex transition-transform duration-200 group-hover:translate-x-1">
            <HugeiconsIcon
              icon={ChevronRightIcon}
              size={20}
              strokeWidth={2}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
