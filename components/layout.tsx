"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Building03Icon, FileIcon, FilePlusIcon, Folder01Icon, Logout01Icon, User03Icon } from "@hugeicons/core-free-icons";

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

export function SiteHeader({ userName, userEmail, isLoggedIn = false }: { userName?: string | null; userEmail?: string | null; isLoggedIn?: boolean }) {
  const [mobileProfileMenuOpen, setMobileProfileMenuOpen] = useState(false);
  const [desktopProfileMenuOpen, setDesktopProfileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const desktopProfileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileProfileMenuOpen(false);
        setDesktopProfileMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileProfileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileProfileMenuOpen]);

  useEffect(() => {
    if (!desktopProfileMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!desktopProfileMenuRef.current?.contains(event.target as Node)) {
        setDesktopProfileMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [desktopProfileMenuOpen]);

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

  const closeMenus = () => {
    setMobileProfileMenuOpen(false);
    setDesktopProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    closeMenus();
    router.replace("/login");
  };

  const isMobileMenuOpen = isLoggedIn && mobileProfileMenuOpen;

  return (
    <>
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
            aria-label="preprence."
            className="font-sans text-[1.65rem] tracking-[-0.04em] text-foreground font-semibold"
          >
            preprence<span className="text-primary">.</span>
          </Link>

          {/* Mobile profile trigger */}
          <div className="md:hidden">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => setMobileProfileMenuOpen((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-expanded={mobileProfileMenuOpen}
                aria-controls="mobile-profile-drawer"
                aria-label={mobileProfileMenuOpen ? "Close profile menu" : "Open profile menu"}
              >
                <UserAvatar name={userName} />
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-10 items-center rounded-full bg-muted px-4 text-sm font-semibold text-primary"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Desktop navigation */}
          <nav
            id="site-navigation"
            className="hidden md:flex md:items-center md:gap-7"
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
                ref={desktopProfileMenuRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => setDesktopProfileMenuOpen((current) => !current)}
                  className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  aria-expanded={desktopProfileMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Open profile menu"
                >
                  <UserAvatar name={userName} />
                </button>

                {desktopProfileMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-3 w-[280px] overflow-hidden rounded-xl border border-border bg-background shadow-xl"
                  >
                    <div className="flex items-center gap-3 border-b border-border bg-primary/10 px-4 py-3.5">
                      <UserAvatar name={userName} />
                      <div className="min-w-0">
                        {userName ? <div className="truncate text-sm font-medium text-foreground">{userName}</div> : null}
                        <div className="truncate text-sm text-muted-foreground">{userEmail || ""}</div>
                      </div>
                    </div>

                    <div className="px-3 py-3">
                      <div className="space-y-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setDesktopProfileMenuOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-foreground/4"
                          role="menuitem"
                        >
                          <HugeiconsIcon
                            icon={User03Icon}
                            className="h-4 w-4"
                          />
                          Profile
                        </Link>

                        <Link
                          href="/dashboard/experiences"
                          onClick={() => setDesktopProfileMenuOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-foreground/4"
                          role="menuitem"
                        >
                          <HugeiconsIcon
                            icon={Folder01Icon}
                            className="h-4 w-4"
                          />
                          Your experiences
                        </Link>
                      </div>

                      <div className="my-3 border-t border-border" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-foreground/4"
                        role="menuitem"
                      >
                        <HugeiconsIcon
                          icon={Logout01Icon}
                          className="h-4 w-4"
                        />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                Login
              </Link>
            )}
          </nav>
        </Container>
      </header>

      {/* Mobile profile drawer lives outside the desktop nav so it can open reliably. */}
      {isMobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close profile menu"
            onClick={() => setMobileProfileMenuOpen(false)}
            className="fixed inset-0 z-[60] bg-foreground/35 md:hidden"
          />

          <aside
            id="mobile-profile-drawer"
            role="dialog"
            aria-label="Profile menu"
            className="fixed right-0 top-0 z-[70] h-dvh w-[min(78vw,380px)] overflow-y-auto border-l border-border bg-background text-left shadow-xl md:hidden"
          >
            <div className="flex items-center gap-3 border-b border-border bg-primary/10 px-5 py-3.5">
              <UserAvatar name={userName} />

              <div className="min-w-0">
                {userName ? <div className="truncate text-base font-medium text-foreground">{userName}</div> : null}

                <div className="truncate text-sm text-muted-foreground">{userEmail || ""}</div>
              </div>
            </div>

            <div className="px-5 py-5">
              <nav aria-label="Mobile navigation">
                <div className="space-y-1">
                  <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explore</p>
                  <Link
                    href="/companies"
                    onClick={() => setMobileProfileMenuOpen(false)}
                    className={cx(
                      "rounded-md px-2 py-3 text-base transition-colors flex gap-2 items-center",
                      pathname === "/companies" ? "font-medium text-primary" : "text-foreground hover:bg-foreground/4",
                    )}
                  >
                    <HugeiconsIcon icon={Building03Icon} /> Companies
                  </Link>

                  <Link
                    href="/experiences"
                    onClick={() => setMobileProfileMenuOpen(false)}
                    className={cx(
                      "rounded-md px-2 py-3 text-base transition-colors flex gap-2 items-center",
                      pathname === "/experiences" ? "font-medium text-primary" : "text-foreground hover:bg-foreground/4",
                    )}
                  >
                    <HugeiconsIcon icon={FileIcon} />
                    Interview experiences
                  </Link>

                  <Link
                    href="/experience/new"
                    onClick={() => setMobileProfileMenuOpen(false)}
                    className={cx(
                      "rounded-md px-2 py-3 text-base transition-colors flex gap-2 items-center",
                      pathname === "/experience/new" ? "font-medium text-primary" : "text-foreground hover:bg-foreground/4",
                    )}
                  >
                    <HugeiconsIcon icon={FilePlusIcon} />
                    Share your experience
                  </Link>
                </div>

                <div className="my-5 border-t border-border" />

                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Account</p>

                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileProfileMenuOpen(false)}
                    className="rounded-md px-2 py-3 text-base text-foreground transition-colors hover:bg-foreground/4 flex gap-2 items-center"
                  >
                    <HugeiconsIcon icon={User03Icon} />
                    Profile
                  </Link>

                  <Link
                    href="/dashboard/experiences"
                    onClick={() => setMobileProfileMenuOpen(false)}
                    className="rounded-md px-2 py-3 text-base text-foreground transition-colors hover:bg-foreground/4 flex gap-2 items-center"
                  >
                    <HugeiconsIcon icon={Folder01Icon} />
                    Your experiences
                  </Link>
                </div>

                <div className="my-5 border-t border-border" />

                {/* <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Log Out</p> */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-md px-2 text-left text-base text-foreground transition-colors hover:bg-foreground/4 flex gap-2 items-center"
                >
                  <HugeiconsIcon icon={Logout01Icon} />
                  Sign out
                </button>
              </nav>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

export function Footer() {
  const pathname = usePathname();
  return (
    <footer className={`mt-auto bg-white/60 border-t border-border py-5 ${pathname === "/login" ? "hidden" : ""}`}>
      <Container className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="font-sans text-[1.25rem] tracking-[-0.04em] text-foreground font-semibold">
          preprence<span className="text-primary">.</span>
        </span>
        <span>Interview experiences from students. For students.</span>
      </Container>
    </footer>
  );
}
