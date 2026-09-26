"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { HugeiconsIcon } from "@hugeicons/react";
import { Building03Icon, FileIcon, Home01Icon, PlusSignIcon, User03Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

type MobileBottomNavProps = {
  onProfileClick?: () => void;
  visibleOnRoutes?: string[];
  hiddenOnRoutes?: string[];
};

const destinations = [
  { label: "Home", href: "/", icon: Home01Icon },
  { label: "Companies", href: "/companies", icon: Building03Icon },
  { label: "Experiences", href: "/experiences", icon: FileIcon },
  { label: "Profile", href: "/dashboard", icon: User03Icon },
] as const;

const defaultHiddenRoutes = ["/login", "/experience/new", "/experience/[id]/edit"];

function matchesRoute(pathname: string, route: string) {
  if (route.includes("[id]")) {
    const prefix = route.split("/[id]")[0];
    return pathname.startsWith(`${prefix}/`) && pathname.endsWith("/edit");
  }

  return pathname === route || pathname.startsWith(`${route}/`);
}

export function MobileNavFloatingPill({ visibleOnRoutes, hiddenOnRoutes = defaultHiddenRoutes }: MobileBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  const shouldRender = (!visibleOnRoutes || visibleOnRoutes.some((route) => matchesRoute(pathname, route))) && !hiddenOnRoutes.some((route) => matchesRoute(pathname, route));

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const difference = currentScrollY - lastScrollY.current;

      if (Math.abs(difference) < 8) return;

      setIsHidden(difference > 0 && currentScrollY > 24);
      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mx-auto w-full px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] transition-transform duration-300 ease-out md:hidden",
        isHidden ? "translate-y-[calc(100%+20px)]" : "translate-y-0",
      )}
    >
      <div className="relative mx-auto max-w-[430px] pr-8">
        <div className="glass-nav-shell flex min-h-[58px] items-center justify-between rounded-full px-3 sm:min-h-[76px]">
          {destinations.map(({ label, href, icon: Icon }) => {
            const isActive = href !== "/" && pathname.startsWith(`${href}/`) ? true : pathname === href;

            return (
              <button
                key={label}
                type="button"
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                onClick={() => router.push(href)}
                className={cn(
                  "relative flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-[11px] font-medium text-[#7b8587] transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:text-[12px]",
                  isActive && "bg-[#e7f5f3]/80 text-primary shadow-sm ring-1 ring-white/60",
                )}
              >
                <HugeiconsIcon
                  icon={Icon}
                  aria-hidden="true"
                  className={cn("size-[18px] shrink-0 transition-all duration-200 ease-out sm:size-[20px]", isActive && "scale-100")}
                  strokeWidth={1.8}
                />
                <span className={cn("max-w-0 overflow-hidden whitespace-nowrap font-semibold transition-all duration-200 ease-out", isActive && "max-w-[72px]")}>{label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Share your experience"
          onClick={() => router.push("/experience/new")}
          className="absolute right-0 top-1/2 flex size-14 -translate-y-1/2 items-center justify-center rounded-full border-4 border-background bg-primary text-card shadow-[0_7px_20px_rgba(20,125,112,0.24)] outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 sm:size-16"
        >
          <HugeiconsIcon
            icon={PlusSignIcon}
            aria-hidden="true"
            className="size-7 sm:size-8"
            strokeWidth={1.8}
          />
        </button>
      </div>
    </nav>
  );
}

export default MobileNavFloatingPill;
