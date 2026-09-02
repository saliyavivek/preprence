"use client";

import { Experience } from "@/lib/types";
import { CompanyMarkLarge } from "./CompanyMark";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, GhostIcon, User03Icon, Cancel01Icon, PlusSignIcon, GraduationCapIcon, School01Icon } from "@hugeicons/core-free-icons";
import { VerdictBadge } from "./VerdictBadge";
import { useState } from "react";
import { SkillCombobox } from "./SkillCombobox";
import { addSkillsToExperience, removeSkillFromExperience } from "@/app/experience/[id]/edit/actions";

type Skill = {
  id: string;
  name: string;
  slug: string;
};

export default function ExperienceHeader({
  experience,
  isEditing = false,
  onSkillsAdded,
  availableSkills = [],
}: {
  experience: Experience;
  isEditing?: boolean;
  onSkillsAdded?: () => void;
  availableSkills?: Skill[];
}) {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAddSkillsModal, setShowAddSkillsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const interviewDate = experience.interviewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const authorLabel = experience.isAnonymous ? "Anonymous" : (experience.author?.name ?? experience.author?.email);

  const allSkills = experience.experienceSkills ?? [];
  const visibleSkills = allSkills.slice(0, 3);
  const hiddenSkillsCount = Math.max(0, allSkills.length - 3);

  const handleAddSkillsSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await addSkillsToExperience(experience.id, formData);
      setShowAddSkillsModal(false);
      // Reload page to refresh experience data
      window.location.reload();
    } catch (error) {
      console.error("Error adding skills:", error);
      alert("Failed to add skills. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkillSubmit = async (formData: FormData) => {
    try {
      await removeSkillFromExperience(experience.id, formData);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-6">
      <CompanyMarkLarge company={experience.company} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-[-0.045em] text-foreground sm:text-3xl lg:text-[2rem]">{experience.company.name}</h1>
          {experience.verdict && (
            <div className="sm:hidden block shrink-0 sm:px-4 sm:py-3">
              <VerdictBadge verdict={experience.verdict} />
            </div>
          )}
        </div>
        <p className="text-xs font-semibold w-fit bg-success/10 rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 text-success sm:text-[0.85rem] sm:leading-tight md:text-[0.9rem]">
          {experience.role?.name || "N/A"}
        </p>
        <div className="flex items-center gap-4 text-xs sm:text-sm">
          {authorLabel && (
            <p className="flex items-center gap-1 text-muted-foreground sm:leading-tight">
              {experience.isAnonymous ? (
                <HugeiconsIcon
                  icon={GhostIcon}
                  className="h-4 w-4"
                  size="100%"
                />
              ) : (
                <HugeiconsIcon
                  icon={User03Icon}
                  className="h-3.5 w-3.5"
                  size="100%"
                />
              )}

              {authorLabel}
            </p>
          )}
          <span
            aria-hidden="true"
            className="text-xs text-gray-200 sm:inline"
          >
            |
          </span>
          <span className="flex items-center gap-1 text-muted-foreground sm:leading-tight">
            <HugeiconsIcon
              className="w-4 h-4"
              size="100%"
              icon={Calendar03Icon}
            />
            {interviewDate}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          {allSkills.length > 0 ? (
            <>
              {visibleSkills.map((es) => (
                <div
                  key={es.skill.id}
                  className="inline-flex items-center font-medium text-foreground/80 gap-1 rounded-md border border-border px-2.5 py-1 "
                >
                  <span>{es.skill.name}</span>
                  {isEditing && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        await handleDeleteSkillSubmit(formData);
                      }}
                      className="flex flex-col gap-4"
                    >
                      {/* Add this hidden input to pass the skill ID */}
                      <input
                        type="hidden"
                        name="skillId"
                        value={es.skill.id}
                      />
                      <button
                        type="submit"
                        className="ml-1 inline-flex hover:opacity-70"
                        title="Remove skill"
                      >
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          className="h-3 w-3"
                        />
                      </button>
                    </form>
                  )}
                </div>
              ))}
              {hiddenSkillsCount > 0 && (
                <button
                  onClick={() => setShowAllSkills(true)}
                  className="inline-flex items-center rounded-md border border-border bg-primary/10 px-2.5 py-1 font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  +{hiddenSkillsCount}
                </button>
              )}
              {isEditing && (
                <button
                  onClick={() => setShowAddSkillsModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1 font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    className="h-4 w-4"
                  />
                  Add more
                </button>
              )}
            </>
          ) : isEditing ? (
            <button
              onClick={() => setShowAddSkillsModal(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1 font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <HugeiconsIcon
                icon={PlusSignIcon}
                className="h-4 w-4"
              />
              Add skills
            </button>
          ) : (
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground sm:text-sm">
              <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
                <HugeiconsIcon
                  className="w-4 h-4"
                  icon={GraduationCapIcon}
                />
                {experience.degree}
              </span>
              <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
                <HugeiconsIcon
                  className="w-4 h-4"
                  size="100%"
                  icon={School01Icon}
                />
                Class of {experience.graduationYear}
              </span>
            </div>
          )}
        </div>

        {/* Add Skills Modal */}
        {showAddSkillsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative flex max-h-[80vh] w-full max-w-md flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add skills to your experience</h2>
                <button
                  onClick={() => setShowAddSkillsModal(false)}
                  className="rounded-lg p-2 hover:bg-muted transition-colors"
                  aria-label="Close"
                  disabled={isSubmitting}
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    className="h-5 w-5"
                  />
                </button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  await handleAddSkillsSubmit(formData);
                }}
                className="flex flex-col gap-4"
              >
                <SkillCombobox skills={availableSkills} />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Skills"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* All Skills Modal */}
        {showAllSkills && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative flex max-h-[80vh] w-full max-w-sm flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Skills ({allSkills.length})</h2>
                <button
                  onClick={() => setShowAllSkills(false)}
                  className="rounded-lg p-2 hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    className="h-5 w-5"
                  />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 overflow-y-auto">
                {allSkills.map((es) => (
                  <span
                    key={es.skill.id}
                    className="inline-flex items-center text-[14px] sm:text-[16px] rounded-md border border-border bg-muted px-3 py-1.5 font-medium text-foreground"
                  >
                    {es.skill.name}
                    {isEditing && (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          await handleDeleteSkillSubmit(formData);
                        }}
                        className="flex flex-col gap-4"
                      >
                        {/* Add this hidden input to pass the skill ID */}
                        <input
                          type="hidden"
                          name="skillId"
                          value={es.skill.id}
                        />
                        <button
                          type="submit"
                          className="ml-1 inline-flex hover:opacity-70"
                          title="Remove skill"
                        >
                          <HugeiconsIcon
                            icon={Cancel01Icon}
                            className="h-3 w-3"
                          />
                        </button>
                      </form>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
