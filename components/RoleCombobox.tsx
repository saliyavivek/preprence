"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Role = {
  id: string;
  name: string;
  slug: string;
};

function RoleOption({ role, onSelect }: { role: Role; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 border-b border-border/70 px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none sm:px-4"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{role.name}</span>
      </span>
    </button>
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

export function RoleCombobox({ roles }: { roles: Role[] }) {
  const [query, setQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const value = query.trim();
    if (!value || selectedRole) return [];

    return roles
      .map((role) => ({
        role,
        score: getMatchScore(value, role.name),
      }))
      .filter(({ score }) => score > 0.3)
      .sort((left, right) => right.score - left.score)
      .slice(0, 8)
      .map(({ role }) => role);
  }, [roles, query, selectedRole]);

  const exactMatch = matches.find((role) => normalizeQuery(role.name) === normalizeQuery(query));
  const visibleRoles = query.trim() ? matches : roles;

  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, []);

  function selectRole(role: Role) {
    setSelectedRole(role);
    setQuery(role.name);
    setIsOpen(false);
  }

  function useNewRole() {
    setSelectedRole(null);
    setQuery(query.trim());
    setIsOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className="relative"
    >
      <input
        id="roleId"
        name="roleName"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setSelectedRole(null);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search or select a role..."
        autoComplete="off"
        required
        className="min-h-14 w-full rounded-xl border border-input bg-background px-4 pr-12 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 cursor-pointer"
      />
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size="100%"
        className={`pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      />

      {isOpen && !selectedRole && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-50 overflow-y-scroll rounded-xl border border-border bg-card shadow-xl">
          {!query.trim() ? (
            visibleRoles.map((role) => (
              <RoleOption
                key={role.id}
                role={role}
                onSelect={() => selectRole(role)}
              />
            ))
          ) : exactMatch ? (
            <RoleOption
              role={exactMatch}
              onSelect={() => selectRole(exactMatch)}
            />
          ) : matches.length ? (
            <>
              {matches.map((role) => (
                <RoleOption
                  key={role.id}
                  role={role}
                  onSelect={() => selectRole(role)}
                />
              ))}
              <button
                type="button"
                onClick={useNewRole}
                className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-left text-sm text-primary transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  className="h-4 w-4"
                />
                Use &quot;{query.trim()}&quot; instead
              </button>
            </>
          ) : (
            <>
              <p className="border-b border-border px-4 py-3 text-sm text-muted-foreground">No matching role found.</p>
              <button
                type="button"
                onClick={useNewRole}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-primary transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  className="h-4 w-4"
                />
                Use &quot;{query.trim()}&quot; as new role
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
