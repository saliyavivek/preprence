// components/GlobalSearch.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { GlobalSearchItem, SearchEntity } from "./GlobalSearchItem";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    companies: SearchEntity[];
    roles: SearchEntity[];
    skills: SearchEntity[];
  }>({ companies: [], roles: [], skills: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus shortcut: Cmd/Ctrl + K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setResults({ companies: [], roles: [], skills: [] });
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(normalizedQuery)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setResults({
          companies: (data.companies || []).map((c: any) => ({ ...c, type: "company" })),
          roles: (data.roles || []).map((r: any) => ({ ...r, type: "role" })),
          skills: (data.skills || []).map((s: any) => ({ ...s, type: "skill" })),
        });
        setIsOpen(true);
      } catch (error) {
        if (!controller.signal.aborted) {
          setResults({ companies: [], roles: [], skills: [] });
          setIsOpen(true);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      if (!searchRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, []);

  const hasResults = results.companies.length > 0 || results.roles.length > 0 || results.skills.length > 0;

  return (
    <div
      ref={searchRef}
      className="relative w-full"
    >
      <div className="relative flex items-center w-full">
        <HugeiconsIcon
          icon={Search01Icon}
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search companies, roles, skills..."
          autoComplete="off"
          className="h-10 w-full rounded-lg border border-border/80 bg-background/50 pl-10 pr-14 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-border focus:bg-background focus:ring-1 focus:ring-ring"
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={14}
              />
            </button>
          ) : (
            <kbd className="pointer-events-none hidden select-none items-center gap-0.5 rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
              <span className="text-xs">⌘ </span> + K
            </kbd>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(26rem,calc(100vh-10rem))] overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">Searching...</p>
          ) : hasResults ? (
            <div className="flex flex-col py-1">
              {results.companies.length > 0 && (
                <div className="py-1">
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Companies</div>
                  {results.companies.map((company) => (
                    <GlobalSearchItem
                      key={`c-${company.id}`}
                      entity={company}
                      href={`/companies/${company.slug}`}
                    />
                  ))}
                </div>
              )}

              {results.roles.length > 0 && (
                <div className={`py-1 ${results.companies.length > 0 ? "border-t border-border/50" : ""}`}>
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Roles</div>
                  {results.roles.map((role) => (
                    <GlobalSearchItem
                      key={`r-${role.id}`}
                      entity={role}
                      href={`/experiences/role/${role.slug}`}
                    />
                  ))}
                </div>
              )}

              {results.skills.length > 0 && (
                <div className={`py-1 ${results.companies.length > 0 || results.roles.length > 0 ? "border-t border-border/50" : ""}`}>
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Skills</div>
                  {results.skills.map((skill) => (
                    <GlobalSearchItem
                      key={`s-${skill.id}`}
                      entity={skill}
                      href={`/experiences/skill/${skill.slug}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground">No results found for "{query}"</p>
          )}
        </div>
      )}
    </div>
  );
}
