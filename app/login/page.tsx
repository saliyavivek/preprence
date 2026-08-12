"use client";

import { FormEvent, useState } from "react";
import { sendMagicLink } from "./actions";

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
      setMessage("Check your email for the sign-in link.");
    }

    setLoading(false);
  }

  return (
    <main>
      <h1>Sign in</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="College email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Continue"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
