"use client";

import { useState } from "react";
import { GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createClient } from "@/lib/supabase/client";
import Logo from "./Logo";

type LoginFormProps = {
  initialMessage: string;
  nextPath: string;
};

export function LoginForm({ initialMessage, nextPath }: LoginFormProps) {
  const [message, setMessage] = useState(initialMessage);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setMessage("");

    const supabase = createClient();
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", nextPath);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      setGoogleLoading(false);
      setMessage("We couldn't start Google sign in. Please try again.");
    }
  }

  const sent = message === "Check your email for the sign-in link.";

  return (
    <main className="flex min-h-svh w-full items-center justify-center px-4 py-8 sm:min-h-screen sm:px-8 sm:py-16">
      <section className="w-full max-w-120 rounded-xl border border-border bg-white/60 px-4 py-6 shadow-[0_12px_40px_rgba(32,37,34,0.04)] sm:px-10 sm:py-10">
        <div className="flex flex-col gap-4 sm:gap-6">
          <header className="flex flex-col items-center gap-4 text-center">
            <p className="hidden text-2xl font-semibold tracking-tighter text-foreground sm:block">
              <Logo className="w-28 h-auto" />
            </p>
            <div className="flex flex-col gap-3">
              <h1 className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-2 gap-y-1 text-2xl font-semibold tracking-[-0.04em] text-foreground sm:flex-nowrap sm:text-4xl">
                <span className="pb-2">Sign in to</span>
                <Logo className="w-38 h-auto" />
              </h1>
              <p className="text-sm leading-7 text-muted-foreground sm:text-[1.07rem]">Read and share real interview experiences from your college.</p>
            </div>
          </header>

          <div className="h-px bg-border" />

          {message && !sent && (
            <p
              role="alert"
              className="rounded-md border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive"
            >
              {message}
            </p>
          )}

          {sent ? (
            <div
              className="flex flex-col gap-6"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-4 rounded-lg border border-primary/20 bg-primary/5 p-5">
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
                  <p className="leading-7 text-muted-foreground">We sent a sign-in link to the email address you entered. Open your email and follow the link to continue to Preprence.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMessage("")}
                className="self-start text-sm font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:items-center">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-input bg-background px-5 font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <HugeiconsIcon
                  icon={GoogleIcon}
                  size="100%"
                  className="h-5 w-5"
                />
                {googleLoading ? "Loading..." : "Continue with Google"}
              </button>
              <p className="text-sm text-muted-foreground sm:text-[1rem]">Use your @ldce.ac.in college email address to sign in.</p>
            </div>
          )}

          {!sent && (
            <>
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-foreground">Why a college email?</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  <Logo className="w-17 h-auto inline-block" /> is built around real interview experiences from students. Using a college email helps keep the community focused on students and their
                  experiences.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
