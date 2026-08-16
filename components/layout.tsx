"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}
export function Section({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cx("py-14 sm:py-20", className)}>{children}</section>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="border-b border-border bg-background/95">
      <Container className="flex min-h-18 items-center justify-between">
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tight text-foreground"
        >
          preprence<span className="text-primary">.</span>
        </Link>
        <button
          className="min-h-11 rounded-md border border-border px-3 text-sm md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="site-navigation"
        >
          Menu
        </button>
        <nav
          id="site-navigation"
          className={cx(
            "absolute left-0 right-0 top-18 z-10 border-b border-border bg-background px-5 py-4 md:static md:flex md:items-center md:gap-7 md:border-0 md:bg-transparent md:p-0",
            !open && "hidden md:flex",
          )}
        >
          <Link
            href="/companies"
            aria-current={pathname === "/companies" ? "page" : undefined}
            className={cx(
              "relative block py-2 text-sm transition-colors hover:text-foreground",
              pathname === "/companies"
                ? "font-semibold text-primary after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-7 after:-translate-x-1/2 after:bg-primary after:content-['']"
                : "text-muted-foreground",
            )}
          >
            Companies
          </Link>
          <Link
            href="/experience/new"
            className="block py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Share experience
          </Link>
          <Link
            href="/login"
            className="mt-2 inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground md:mt-0"
          >
            Login
          </Link>
        </nav>
      </Container>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-8">
      <Container className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono font-semibold text-foreground">preprence.</span>
        <span>Real stories. Better preparation.</span>
      </Container>
    </footer>
  );
}
