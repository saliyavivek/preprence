// components/GlobalSearch.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { GlobalSearchItem, SearchEntity } from "./GlobalSearchItem";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ companies: SearchEntity[]; roles: SearchEntity[]; skills: SearchEntity[] }>({
    companies: [],
    roles: [],
    skills: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

        // Map types to results to help the item component render properly
        setResults({
          companies: data.companies.map((c: any) => ({ ...c, type: "company" })),
          roles: data.roles.map((r: any) => ({ ...r, type: "role" })),
          skills: data.skills.map((s: any) => ({ ...s, type: "skill" })),
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
    }, 250); // Debounce as in original CompanySearch.tsx[cite: 5]

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
      className="relative min-w-0 flex-1"
    >
      <form
        action="/search"
        method="get"
        className="flex w-full flex-col gap-3 sm:flex-row"
      >
        <label
          htmlFor="global-search"
          className="sr-only"
        >
          Search
        </label>
        <div className="relative min-w-0 flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            size="100%"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="global-search"
            name="q"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder="Search companies, roles, or skills..."
            autoComplete="off"
            className="h-12 w-full rounded-md border border-input bg-white/60 pl-11 pr-11 text-base outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 [&::-webkit-search-cancel-button]:appearance-none"
          />

          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                className="h-4 w-4"
                size="100%"
              />
            </button>
          )}

          {isOpen && query.trim() && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[min(26rem,calc(100vh-10rem))] overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
              {isLoading ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">Searching...</p>
              ) : hasResults ? (
                <div className="flex flex-col">
                  {results.companies.length > 0 && (
                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase text-muted-foreground">Companies</div>
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
                    <div className="py-1 border-t border-border/50">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase text-muted-foreground">Roles</div>
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
                    <div className="py-1 border-t border-border/50">
                      <div className="px-3 py-1.5 text-xs font-semibold uppercase text-muted-foreground">Skills</div>
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
        <button
          type="submit"
          className="h-12 w-full rounded-md bg-primary px-8 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
        >
          Search
        </button>
      </form>
    </div>
  );
}
