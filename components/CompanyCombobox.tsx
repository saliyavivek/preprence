"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { companySimilarity, isCloseCompanyMatch, normalizeCompanyName } from "@/lib/company-matching";

type Company = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  _count?: { experiences: number };
};

function CompanyOption({ company, onSelect }: { company: Company; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">{company.name}</span>
        <span className="block text-xs text-muted-foreground">
          {company._count?.experiences ?? 0} interview {(company._count?.experiences ?? 0) === 1 ? "experience" : "experiences"}
        </span>
      </span>
    </button>
  );
}

export function CompanyCombobox({ companies }: { companies: Company[] }) {
  const [query, setQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const value = query.trim();
    if (!value || selectedCompany) return [];

    return companies
      .map((company) => ({ company, score: companySimilarity(value, company.name) }))
      .filter(({ company, score }) => score >= 0.28 || normalizeCompanyName(company.name).includes(normalizeCompanyName(value)))
      .sort((left, right) => right.score - left.score)
      .slice(0, 6)
      .map(({ company }) => company);
  }, [companies, query, selectedCompany]);

  const closeMatch = useMemo(() => {
    if (!query.trim() || selectedCompany || matches.length === 0) return null;
    return matches.find((company) => isCloseCompanyMatch(query, company.name)) ?? null;
  }, [matches, query, selectedCompany]);

  const exactMatch = matches.find((company) => normalizeCompanyName(company.name) === normalizeCompanyName(query));
  const visibleCompanies = query.trim() ? matches : companies.slice(0, 8);

  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, []);

  function selectCompany(company: Company) {
    setSelectedCompany(company);
    setQuery(company.name);
    setIsOpen(false);
  }

  function useNewCompany() {
    setSelectedCompany(null);
    setQuery(query.trim());
    setIsOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className="relative"
    >
      <input
        id="companyId"
        name="companyName"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setSelectedCompany(null);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search or select a company..."
        autoComplete="off"
        required
        className="min-h-14 w-full rounded-xl border border-input bg-background px-4 pr-12 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size="100%"
        className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
      />

      {isOpen && !selectedCompany && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          {!query.trim() ? (
            visibleCompanies.map((company) => (
              <CompanyOption
                key={company.id}
                company={company}
                onSelect={() => selectCompany(company)}
              />
            ))
          ) : exactMatch ? (
            <CompanyOption
              company={exactMatch}
              onSelect={() => selectCompany(exactMatch)}
            />
          ) : closeMatch ? (
            <>
              <div className="border-b border-border px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Did you mean?</p>
                <CompanyOption
                  company={closeMatch}
                  onSelect={() => selectCompany(closeMatch)}
                />
              </div>
              <button
                type="button"
                onClick={useNewCompany}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-primary transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  className="h-4 w-4"
                />
                Use &quot;{query.trim()}&quot; instead
              </button>
            </>
          ) : matches.length ? (
            <>
              {matches.map((company) => (
                <CompanyOption
                  key={company.id}
                  company={company}
                  onSelect={() => selectCompany(company)}
                />
              ))}
              <button
                type="button"
                onClick={useNewCompany}
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
              <p className="border-b border-border px-4 py-3 text-sm text-muted-foreground">No matching company found.</p>
              <button
                type="button"
                onClick={useNewCompany}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-primary transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  className="h-4 w-4"
                />
                Use &quot;{query.trim()}&quot;
              </button>
            </>
          )}
        </div>
      )}

      {selectedCompany ? (
        <input
          type="hidden"
          name="companyId"
          value={selectedCompany.id}
        />
      ) : null}
    </div>
  );
}
