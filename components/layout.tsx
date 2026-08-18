"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function UserAvatar({ name }: { name?: string | null }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase();

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary shadow-sm">
      {initial ? (
        initial
      ) : (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle
            cx="12"
            cy="7"
            r="4"
          />
        </svg>
      )}
    </div>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}
export function Section({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cx("py-14 sm:py-20", className)}>{children}</section>;
}

export function SiteHeader({ userName, userEmail, isLoggedIn = Boolean(userName) }: { userName?: string | null; userEmail?: string | null; isLoggedIn?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsHeaderVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b border-border bg-white/60 backdrop-blur-sm transition-transform duration-300 ease-out",
        pathname === "/login" ? "hidden" : "",
        isHeaderVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <Container className="flex min-h-18 items-center justify-between">
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tight text-foreground"
        >
          preprence<span className="text-primary">.</span>
        </Link>
        <button
          className="min-h-11 rounded-md border border-border px-3 text-sm md:hidden"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-expanded={mobileMenuOpen}
          aria-controls="site-navigation"
        >
          Menu
        </button>
        <nav
          id="site-navigation"
          className={cx(
            "absolute left-0 right-0 top-18 z-10 border-b border-border bg-background px-5 py-4 md:static md:flex md:items-center md:gap-7 md:border-0 md:bg-transparent md:p-0",
            !mobileMenuOpen && "hidden md:flex",
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
            href="/experiences"
            aria-current={pathname === "/experiences" ? "page" : undefined}
            className={cx(
              "relative block py-2 text-sm transition-colors hover:text-foreground",
              pathname === "/experiences"
                ? "font-semibold text-primary after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-7 after:-translate-x-1/2 after:bg-primary after:content-['']"
                : "text-muted-foreground",
            )}
          >
            Interview experiences
          </Link>
          <Link
            href={!isLoggedIn ? "/login" : "/experience/new"}
            className={cx(
              "relative block py-2 text-sm transition-colors hover:text-foreground",
              pathname === "/experience/new"
                ? "font-semibold text-primary after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-7 after:-translate-x-1/2 after:bg-primary after:content-['']"
                : "text-muted-foreground",
            )}
          >
            Share your experience
          </Link>

          {isLoggedIn ? (
            <div
              ref={dropdownRef}
              className="relative mt-2 md:mt-0"
            >
              <button
                type="button"
                onClick={() => setProfileMenuOpen((current) => !current)}
                className="flex items-center gap-2"
                aria-expanded={profileMenuOpen}
                aria-label="Open profile menu"
              >
                <UserAvatar name={userName} />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full z-20 mt-3 w-[260px] overflow-hidden rounded-xl border border-border bg-white text-foreground text-left shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                      {userName?.trim()?.charAt(0)?.toUpperCase() || (
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21a8 8 0 0 0-16 0" />
                          <circle
                            cx="12"
                            cy="7"
                            r="4"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      {userName ? <div className="truncate text-sm font-medium text-foreground">{userName}</div> : null}
                      <div className="truncate text-sm text-foreground">{userEmail || ""}</div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-foreground transition-colors duration-150 hover:bg-foreground/4"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/experiences"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-foreground transition-colors duration-150 hover:bg-foreground/4"
                    >
                      Your experiences
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-left text-sm text-foreground transition-colors duration-150 hover:bg-foreground/4"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="mt-2 inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground md:mt-0"
            >
              Login
            </Link>
          )}
        </nav>
      </Container>
    </header>
  );
}

export function Footer() {
  const pathname = usePathname();
  return (
    <footer className={`mt-auto bg-white/60 border-t border-border py-8 ${pathname === "/login" ? "hidden" : ""}`}>
      <Container className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono font-semibold text-foreground">preprence.</span>
        <span>Real interviews. Better preparation.</span>
      </Container>
    </footer>
  );
}
