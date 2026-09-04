"use client";

import { useEffect, useRef, useState } from "react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CompanySearchItem } from "./CompanySearchItem";

type SearchCompany = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  _count: { experiences: number };
};

export function CompanySearch() {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<SearchCompany[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setCompanies([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/companies/search?q=${encodeURIComponent(normalizedQuery)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search failed");
        const data: { companies: SearchCompany[] } = await response.json();
        setCompanies(data.companies);
        setIsOpen(true);
      } catch (error) {
        if (!controller.signal.aborted) {
          setCompanies([]);
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

  return (
    <div
      ref={searchRef}
      className="relative min-w-0 flex-1"
    >
      <form
        action="/companies"
        method="get"
        className="flex w-full flex-col gap-3 sm:flex-row"
      >
        <label
          htmlFor="company-search"
          className="sr-only"
        >
          Search companies
        </label>
        <div className="relative min-w-0 flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            size="100%"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="company-search"
            name="search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder="Search companies..."
            autoComplete="off"
            className="h-12 w-full rounded-md border border-input bg-white/60 pl-11 pr-4 text-base outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
          />

          {isOpen && query.trim() && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[min(22rem,calc(100vh-10rem))] overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
              {isLoading ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">Searching...</p>
              ) : companies.length ? (
                companies.map((company) => (
                  <CompanySearchItem
                    key={company.id}
                    company={company}
                    href={`/companies/${company.slug}`}
                  />
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-muted-foreground">No companies found</p>
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
