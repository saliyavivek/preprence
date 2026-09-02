"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type VerdictOption = {
  value: string;
  label: string;
};

const VERDICT_OPTIONS: VerdictOption[] = [
  { value: "not_disclosed", label: "Prefer not to say" },
  { value: "selected", label: "Selected" },
  { value: "rejected", label: "Rejected" },
];

function VerdictOption({ option, onSelect }: { option: VerdictOption; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 border-b border-border/70 px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none sm:px-4"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{option.label}</span>
      </span>
    </button>
  );
}

export function VerdictCombobox({ defaultValue = "not_disclosed" }: { defaultValue?: string }) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = VERDICT_OPTIONS.find((opt) => opt.value === selectedValue);

  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, []);

  function selectOption(option: VerdictOption) {
    setSelectedValue(option.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-3"
    >
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name="verdict"
        value={selectedValue}
      />

      {/* Dropdown trigger */}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-input bg-background px-4 text-base text-foreground outline-none transition-colors hover:border-input focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          <span className="text-left">{selectedOption?.label}</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size="100%"
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 rounded-xl border border-border bg-card shadow-xl">
            {VERDICT_OPTIONS.map((option) => (
              <VerdictOption
                key={option.value}
                option={option}
                onSelect={() => selectOption(option)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
