"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Building03Icon, FileIcon, FilePlusIcon, Folder02Icon, Logout01Icon, User03Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

type MobileProfileSheetProps = {
  open: boolean;
  onClose: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
  };
  onLogout?: () => void | Promise<void>;
};

type SheetRowProps = {
  label: string;
  icon: typeof User03Icon;
  onClick: () => void;
};

const accountItems = [
  { label: "Profile", href: "/dashboard", icon: User03Icon },
  { label: "Your experiences", href: "/dashboard/experiences", icon: Folder02Icon },
] as const;

const exploreItems = [
  { label: "Companies", href: "/companies", icon: Building03Icon },
  { label: "Interview experiences", href: "/experiences", icon: FileIcon },
  { label: "Share your experience", href: "/experience/new", icon: FilePlusIcon },
] as const;

function SheetRow({ label, icon: Icon, onClick }: SheetRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-10 w-full items-center gap-3 rounded-xl px-1 text-left text-[15px] text-[#172235] outline-none transition-colors hover:bg-[#f4f7f4] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:bg-[#edf2ef]"
    >
      <HugeiconsIcon
        icon={Icon}
        aria-hidden="true"
        className="size-6 shrink-0 text-[#111820]"
        strokeWidth={1.8}
      />
      <span className="flex-1">{label}</span>
      {!label.toLowerCase().includes("log out") && (
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          aria-hidden="true"
          className="size-5 shrink-0 text-[#7d878a]"
          strokeWidth={1.7}
        />
      )}
    </button>
  );
}

export function MobileProfileSheet({ open, onClose, user, onLogout }: MobileProfileSheetProps) {
  const router = useRouter();
  const name = user?.name?.trim() || "Vivek Saliya";
  const email = user?.email?.trim() || "25mcaviv034@ldce.ac.in";
  const initial = name.charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  const navigate = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleLogout = async () => {
    onClose();
    await onLogout?.();
  };

  return (
    <div
      className={cn("fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ease-out", open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")}
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close account menu"
        onClick={onClose}
        className={cn("absolute inset-0 bg-[#17201f]/45 transition-opacity duration-300 ease-out", open ? "opacity-100" : "opacity-0")}
      />

      <section
        role="dialog"
        aria-modal={open}
        aria-labelledby="mobile-profile-sheet-title"
        className={cn(
          "absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto rounded-t-[30px] bg-card px-6 pb-[calc(env(safe-area-inset-bottom)+22px)] pt-6 shadow-[0_-8px_32px_rgba(25,45,40,0.14)] transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* <div
          className="mx-auto mb-6 h-1.5 w-14 rounded-full bg-[#cbd1d1]"
          aria-hidden="true"
        /> */}

        <div className="flex items-center gap-4">
          <div className="flex size-[58px] shrink-0 items-center justify-center rounded-full bg-[#147d70] text-[25px] font-medium text-white">{initial}</div>
          <div className="min-w-0">
            <h2
              id="mobile-profile-sheet-title"
              className="truncate text-[20px] font-semibold tracking-[-0.02em] text-[#172235]"
            >
              {name}
            </h2>
            <p className="mt-1 truncate text-[16px] text-[#899397]">{email}</p>
          </div>
        </div>

        <div className="my-6 h-px bg-[#dce2df]" />

        <div className="flex flex-col gap-1">
          <p className="mb-3 px-1 text-[13px] font-semibold capitalize tracking-[0.04em] text-[#7f898b]">Your account</p>
          {accountItems.map((item) => (
            <SheetRow
              key={item.label}
              label={item.label}
              icon={item.icon}
              onClick={() => navigate(item.href)}
            />
          ))}
        </div>

        <div className="my-4 h-px bg-[#dce2df]" />

        <p className="mb-3 px-1 text-[13px] font-semibold capitalize tracking-[0.04em] text-[#7f898b]">Explore</p>
        <div className="flex flex-col gap-1">
          {exploreItems.map((item) => (
            <SheetRow
              key={item.label}
              label={item.label}
              icon={item.icon}
              onClick={() => navigate(item.href)}
            />
          ))}
        </div>

        <div className="my-4 h-px bg-[#dce2df]" />

        <SheetRow
          label="Log out"
          icon={Logout01Icon}
          onClick={handleLogout}
        />
      </section>
    </div>
  );
}

export default MobileProfileSheet;
