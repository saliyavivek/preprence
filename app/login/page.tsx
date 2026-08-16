"use client";

import { FormEvent, useState } from "react";
import { sendMagicLink } from "./actions";

const successMessage = "Check your email for the sign-in link.";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const result = await sendMagicLink(email);

    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage(successMessage);
    }

    setLoading(false);
  }

  const sent = message === successMessage;

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
      <section className="w-full max-w-[30rem] rounded-xl border border-border bg-card px-6 py-8 shadow-[0_12px_40px_rgba(32,37,34,0.04)] sm:px-10 sm:py-10">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col items-center gap-4 text-center">
            <p className="text-2xl font-semibold tracking-[-0.05em] text-foreground">
              preprence<span className="text-primary">.</span>
            </p>
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Sign in to Preprence</h1>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">Read and share real interview experiences from your college.</p>
            </div>
          </header>

          <div className="h-px bg-border" />

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
            <form
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
                  Use your college email address. We&apos;ll send you a secure sign-in link. No password required.
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
                disabled={loading}
                className="min-h-12 rounded-md bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </form>
          )}

          {!sent && (
            <>
              <div className="h-px bg-border" />
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-foreground">Why a college email?</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Preprence is built around real interview experiences from students. Using a college email helps keep the community focused on students and their experiences.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
