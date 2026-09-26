"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { createClient } from "@/lib/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, ChevronDownIcon, Folder02Icon, Linkedin01Icon, Logout01Icon, Mail01Icon, Pen01Icon, User03Icon } from "@hugeicons/core-free-icons";
import Logo from "./Logo";
import { GlobalSearch } from "./GlobalSearch";
import { MobileNavFloatingPill } from "./MobileNavFloatingPill";
import { MobileProfileSheet } from "./MobileProfileSheet";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function UserAvatar({ name }: { name?: string | null }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shadow-xs">{initial}</div>;
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cx("py-14 sm:py-20", className)}>{children}</section>;
}

export function SiteHeader({ userName, userEmail, isLoggedIn = false }: { userName?: string | null; userEmail?: string | null; isLoggedIn?: boolean }) {
  const [mobileProfileMenuOpen, setMobileProfileMenuOpen] = useState(false);
  const [desktopProfileMenuOpen, setDesktopProfileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn);

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
    setIsAuthenticated(false);
    closeMenus();
    router.replace("/");
    router.refresh();
  };

  const isMobileMenuOpen = isAuthenticated && mobileProfileMenuOpen;

  const handleOpenMobileProfileSheet = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setMobileProfileMenuOpen(true);
  };

  return (
    <>
      <header
        className={cx("sticky top-0 mx-auto mt-4 z-50 transition-transform duration-300 ease-out", pathname === "/login" ? "hidden" : "", isHeaderVisible ? "translate-y-0" : "-translate-y-full")}
      >
        <Container className="py-2">
          <div className="glass-nav-shell flex h-[58px] items-center justify-between gap-4 rounded-full px-4 sm:h-16 sm:gap-6 sm:px-6">
            {/* Left: Brand & Nav Links */}
            <div className="flex items-center gap-6 lg:gap-8">
              <Link
                href="/"
                aria-label="preprence."
                className="shrink-0 mt-1"
              >
                <Logo className="h-4 sm:h-5 w-auto" />
              </Link>

              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                <Link
                  href="/companies"
                  className={cx("transition-colors hover:text-primary", pathname === "/companies" && "text-primary font-semibold")}
                >
                  Companies
                </Link>

                <Link
                  href="/experiences"
                  className={cx("inline-flex items-center gap-1 transition-colors hover:text-primary", pathname.startsWith("/experiences") && "text-primary font-semibold")}
                >
                  <span>Experiences</span>
                </Link>
              </nav>
            </div>

            {/* Middle: Global Search Input (Hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg items-center justify-center">
              <GlobalSearch />
            </div>

            {/* Right: Write Experience & Profile */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href={!isAuthenticated ? "/login" : "/experience/new"}
                className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-primary text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto text-sm font-medium"
              >
                <HugeiconsIcon
                  icon={Pen01Icon}
                  size="100%"
                  className="w-4 h-4"
                />
                Write experience
              </Link>
              {isAuthenticated ? (
                <>
                  <span
                    className="h-4 w-[1px] bg-border/70"
                    aria-hidden="true"
                  />

                  <div
                    ref={desktopProfileMenuRef}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={() => setDesktopProfileMenuOpen((current) => !current)}
                      className="flex items-center gap-1.5 rounded-full p-0.5 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      aria-expanded={desktopProfileMenuOpen}
                      aria-haspopup="menu"
                      aria-label="Open profile menu"
                    >
                      <UserAvatar name={userName} />
                      <HugeiconsIcon
                        icon={ChevronDownIcon}
                        size={14}
                        strokeWidth={2.5}
                        className={`text-muted-foreground transition-transform duration-200 ${desktopProfileMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {desktopProfileMenuOpen && (
                      <div
                        role="menu"
                        className="absolute right-0 top-full z-50 mt-6 w-70 overflow-hidden rounded-xl border border-border bg-background shadow-xl"
                      >
                        <div className="flex items-center gap-3 border-b border-border bg-primary/10 px-4 py-3.5">
                          <UserAvatar name={userName} />
                          <div className="min-w-0">
                            {userName ? <div className="truncate text-sm font-medium text-foreground">{userName}</div> : null}
                            <div className="truncate text-xs text-muted-foreground">{userEmail || ""}</div>
                          </div>
                        </div>

                        <div className="px-3 py-3">
                          <div className="space-y-1">
                            <Link
                              href="/dashboard"
                              onClick={() => setDesktopProfileMenuOpen(false)}
                              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
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
                              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                              role="menuitem"
                            >
                              <HugeiconsIcon
                                icon={Folder02Icon}
                                className="h-4 w-4"
                              />
                              Your experiences
                            </Link>
                          </div>

                          <div className="my-2 border-t border-border" />

                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
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
                </>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Mobile Avatar / Trigger (Preserved mobile implementation) */}
            <div className="md:hidden flex items-center">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleOpenMobileProfileSheet}
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
                  className="inline-flex min-h-9 items-center rounded-full bg-muted/70 px-4 text-sm font-semibold text-primary"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </Container>
      </header>

      <MobileNavFloatingPill
        visibleOnRoutes={["/", "/companies", "/experiences", "/dashboard", "/profile"]}
        hiddenOnRoutes={["/login", "/experience/new", "/experience/[id]/edit"]}
      />

      <MobileProfileSheet
        open={isMobileMenuOpen}
        onClose={() => setMobileProfileMenuOpen(false)}
        user={{ name: userName, email: userEmail }}
        onLogout={handleLogout}
      />
    </>
  );
}

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className={`mt-auto border-t border-border bg-white/60 ${pathname === "/login" ? "hidden" : ""}`}>
      <Container className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex w-full flex-col gap-8 py-10 sm:gap-10 sm:py-12 lg:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm space-y-3">
              <Link
                href="/"
                aria-label="preprence."
              >
                <Logo className="h-5 w-auto" />
              </Link>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">Interview experiences from students. For students.</p>
            </div>

            <nav
              aria-label="Footer navigation"
              className="hidden flex-wrap gap-x-7 gap-y-3 text-sm text-foreground md:flex lg:justify-end"
            >
              <Link
                href="/companies"
                className="transition-colors hover:text-primary"
              >
                Companies
              </Link>
              <Link
                href="/experiences"
                className="transition-colors hover:text-primary"
              >
                Experiences
              </Link>
              <Link
                href="/experience/new"
                className="transition-colors hover:text-primary"
              >
                Share experience
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:pt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <div className="flex w-full gap-4 flex-col lg:flex-row lg:justify-between">
              <div className="flex items-start gap-2 leading-6 flex-1">
                <HugeiconsIcon
                  icon={Alert02Icon}
                  size={16}
                  strokeWidth={1.8}
                  className="mt-1 shrink-0"
                  aria-hidden="true"
                />
                <p>preprence is an independent student platform and is not affiliated with or endorsed by any of the companies mentioned on this website.</p>
              </div>

              <div className="pl-6 text-muted-foreground/80 leading-6 flex-1 lg:text-right">
                Found a bug or have a suggestion? Reach out on{" "}
                <a
                  href="https://www.linkedin.com/in/viveksaliya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-baseline gap-[0.8] font-medium underline decoration-border underline-offset-2 transition-colors hover:text-primary whitespace-nowrap"
                >
                  <HugeiconsIcon
                    icon={Linkedin01Icon}
                    size={14}
                    strokeWidth={1.8}
                    className="shrink-0 translate-y-0.5"
                    aria-hidden="true"
                  />
                  <span>LinkedIn</span>
                </a>{" "}
                or{" "}
                <a
                  href="mailto:viveksaliya007@gmail.com"
                  className="inline-flex items-baseline gap-1 font-medium underline decoration-border underline-offset-2 transition-colors hover:text-primary whitespace-nowrap"
                >
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={14}
                    strokeWidth={1.8}
                    className="shrink-0 translate-y-0.5"
                    aria-hidden="true"
                  />
                  <span>Email</span>
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
