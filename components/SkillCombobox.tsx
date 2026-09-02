"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown01Icon, Cancel01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Skill = {
  id: string;
  name: string;
  slug: string;
};

function SkillOption({ skill, onSelect }: { skill: Skill; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 border-b border-border/70 px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none sm:px-4"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{skill.name}</span>
      </span>
    </button>
  );
}

function SkillTag({ skill, onRemove }: { skill: Skill; onRemove: () => void }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
      <span>{skill.name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 inline-flex hover:opacity-70"
        aria-label={`Remove ${skill.name}`}
      >
        <HugeiconsIcon
          icon={Cancel01Icon}
          className="h-3 w-3"
        />
      </button>
    </div>
  );
}

function normalizeQuery(text: string): string {
  return text.toLowerCase().trim();
}

function getMatchScore(query: string, name: string): number {
  const normalizedQuery = normalizeQuery(query);
  const normalizedName = normalizeQuery(name);

  if (normalizedName === normalizedQuery) return 1;
  if (normalizedName.startsWith(normalizedQuery)) return 0.9;
  if (normalizedName.includes(normalizedQuery)) return 0.7;

  // Simple character similarity
  const queryChars = new Set(normalizedQuery);
  const nameChars = new Set(normalizedName);
  const common = [...queryChars].filter((c) => nameChars.has(c)).length;
  return (common / Math.max(queryChars.size, 1)) * 0.5;
}

export function SkillCombobox({ skills }: { skills: Skill[] }) {
  const [query, setQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedIds = new Set(selectedSkills.map((s) => s.id));
  const availableSkills = skills.filter((s) => !selectedIds.has(s.id));

  const matches = useMemo(() => {
    const value = query.trim();
    if (!value) return [];

    return availableSkills
      .map((skill) => ({
        skill,
        score: getMatchScore(value, skill.name),
      }))
      .filter(({ score }) => score > 0.3)
      .sort((left, right) => right.score - left.score)
      .slice(0, 8)
      .map(({ skill }) => skill);
  }, [availableSkills, query]);

  const exactMatch = matches.find((skill) => normalizeQuery(skill.name) === normalizeQuery(query));
  const visibleSkills = query.trim() ? matches : availableSkills;

  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, []);

  function addSkill(skill: Skill) {
    setSelectedSkills((prev) => [...prev, skill]);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  }

  function removeSkill(skillId: string) {
    setSelectedSkills((prev) => prev.filter((s) => s.id !== skillId));
  }

  function useNewSkill() {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const newSkill: Skill = {
      id: `new-${Date.now()}`,
      name: trimmedQuery,
      slug: trimmedQuery.toLowerCase().replace(/\s+/g, "-"),
    };

    setSelectedSkills((prev) => [...prev, newSkill]);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-3"
    >
      {/* Hidden inputs for form submission */}
      {selectedSkills.map((skill) => (
        <input
          key={skill.id}
          type="hidden"
          name="skillIds"
          value={skill.id}
        />
      ))}
      {selectedSkills.map((skill) => (
        <input
          key={`name-${skill.id}`}
          type="hidden"
          name="skillNames"
          value={skill.name}
        />
      ))}

      {/* Selected skills display */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <SkillTag
              key={skill.id}
              skill={skill}
              onRemove={() => removeSkill(skill.id)}
            />
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <input
          ref={inputRef}
          id="skillSearch"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search or add a skill..."
          autoComplete="off"
          className="min-h-14 w-full rounded-xl border border-input bg-background px-4 pr-12 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 cursor-pointer"
        />
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size="100%"
          className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        />

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-50 overflow-y-scroll rounded-xl border border-border bg-card shadow-xl">
            {!query.trim() ? (
              visibleSkills.length > 0 ? (
                visibleSkills.map((skill) => (
                  <SkillOption
                    key={skill.id}
                    skill={skill}
                    onSelect={() => addSkill(skill)}
                  />
                ))
              ) : (
                <p className="border-b border-border px-4 py-3 text-sm text-muted-foreground">No skills available.</p>
              )
            ) : exactMatch ? (
              <SkillOption
                skill={exactMatch}
                onSelect={() => addSkill(exactMatch)}
              />
            ) : matches.length ? (
              <>
                {matches.map((skill) => (
                  <SkillOption
                    key={skill.id}
                    skill={skill}
                    onSelect={() => addSkill(skill)}
                  />
                ))}
                <button
                  type="button"
                  onClick={useNewSkill}
                  className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-left text-sm text-primary transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    className="h-4 w-4"
                  />
                  Add &quot;{query.trim()}&quot; as new skill
                </button>
              </>
            ) : (
              <>
                <p className="border-b border-border px-4 py-3 text-sm text-muted-foreground">No matching skills found.</p>
                <button
                  type="button"
                  onClick={useNewSkill}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-primary transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    className="h-4 w-4"
                  />
                  Add &quot;{query.trim()}&quot; as new skill
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
