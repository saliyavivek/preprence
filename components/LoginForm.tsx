"use client";

import { FormEvent, useState } from "react";
import { GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createClient } from "@/lib/supabase/client";
import { sendMagicLink } from "@/app/login/actions";

const successMessage = "Check your email for the sign-in link.";

type LoginFormProps = {
  initialMessage: string;
  nextPath: string;
};

export function LoginForm({ initialMessage, nextPath }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await sendMagicLink(email, nextPath);
    setMessage(result.error ?? successMessage);
    setLoading(false);
  }

  const sent = message === successMessage;

  return (
    <main className="flex min-h-svh w-full items-center justify-center px-4 py-8 sm:min-h-screen sm:px-8 sm:py-16">
      <section className="w-full max-w-120 rounded-xl border border-border bg-card px-4 py-6 shadow-[0_12px_40px_rgba(32,37,34,0.04)] sm:px-10 sm:py-10">
        <div className="flex flex-col gap-4 sm:gap-6">
          <header className="flex flex-col items-center gap-4 text-center">
            <p className="hidden text-2xl font-semibold tracking-tighter text-foreground sm:block">
              preprence<span className="text-primary">.</span>
            </p>
            <div className="flex flex-col gap-3">
              <h1 className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-2 gap-y-1 text-2xl font-semibold tracking-[-0.04em] text-foreground sm:flex-nowrap sm:text-4xl">
                <span>Sign in to</span>
                <span className="text-3xl font-semibold tracking-tighter text-foreground sm:text-4xl">
                  preprence<span className="text-primary">.</span>
                </span>
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
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-input bg-background px-5 font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <HugeiconsIcon
                  icon={GoogleIcon}
                  size="100%"
                  className="h-5 w-5"
                />
                {googleLoading ? "Loading..." : "Continue with Google"}
              </button>

              {/* <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
              </div> */}

              {/* <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="college-email"
                    className="text-sm font-semibold text-foreground"
                  >
                    College email
                  </label>
                  <input
                    id="college-email"
                    name="email"
                    type="email"
                    placeholder="Enter your college email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    aria-describedby="email-help"
                    className="min-h-12 rounded-md border border-input bg-background px-4 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <p
                    id="email-help"
                    className="text-sm leading-6 text-muted-foreground"
                  >
                    We&apos;ll send you a secure sign-in link. No password required.
                  </p>
                </div>

                {message && (
                  <p
                    role="alert"
                    className="rounded-md border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive"
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="min-h-12 rounded-md bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Continue with email"}
                </button>
              </form> */}
            </>
          )}

          {!sent && (
            <>
              {/* <div className="h-px bg-border" /> */}
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-foreground">Why a college email?</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  <span className="font-semibold tracking-tighter text-foreground">
                    preprence<span className="text-primary">.</span>
                  </span>{" "}
                  is built around real interview experiences from students. Using a college email helps keep the community focused on students and their experiences.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
