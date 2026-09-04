"use client";

import { useEffect, useRef, useState } from "react";
import { Alert02Icon, Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFormStatus } from "react-dom";

function DeleteSubmitButton({ buttonText, pendingText }: { buttonText: string; pendingText: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
    >
      <HugeiconsIcon
        icon={Delete02Icon}
        size="100%"
        className="h-4 w-4"
      />
      {pending ? pendingText : buttonText}
    </button>
  );
}

function CancelButton({ onClick }: { onClick: () => void }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="min-h-10 rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Cancel
    </button>
  );
}

interface DeleteConfirmationModalProps {
  action: (formData: FormData) => Promise<void>;
  title?: string;
  description?: string;
  buttonText?: string;
  pendingText?: string;
}

export function DeleteConfirmationModal({
  action,
  title = "Delete this experience?",
  description = "This action is permanent. The experience, its interview rounds, and reports will be deleted.",
  buttonText = "Delete experience",
  pendingText = "Deleting...",
}: DeleteConfirmationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="min-h-10 flex items-center gap-1 flex-1 rounded-md border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5 focus:outline-none focus:ring-2 focus:ring-destructive/20 sm:w-auto"
      >
        <HugeiconsIcon
          icon={Delete02Icon}
          size="100%"
          className="w-4 h-4"
        />
        Delete
      </button>

      {isOpen && (
        <dialog
          ref={dialogRef}
          open
          aria-labelledby="delete-experience-title"
          aria-describedby="delete-experience-description"
          tabIndex={-1}
          className="fixed inset-0 z-50 m-0 flex h-full w-full max-w-none items-center justify-center border-0 bg-black/35 p-4 outline-none backdrop:bg-black/35"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-white/60 p-5 shadow-xl sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <HugeiconsIcon
                  icon={Alert02Icon}
                  size="100%"
                  className="h-6 w-6"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h2
                    id="delete-experience-title"
                    className="text-lg font-semibold text-foreground"
                  >
                    {title}
                  </h2>
                  <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close delete confirmation"
                    className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      size="100%"
                      className="h-5 w-5"
                    />
                  </button>
                </div>
                <p
                  id="delete-experience-description"
                  className="mt-2 text-sm leading-6 text-muted-foreground"
                >
                  {description}
                </p>
              </div>
            </div>

            <form
              action={action}
              className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
            >
              <CancelButton onClick={closeModal} />
              <DeleteSubmitButton
                buttonText={buttonText}
                pendingText={pendingText}
              />
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}
