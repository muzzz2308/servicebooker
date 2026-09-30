"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";

import { AuthLink, AuthShell } from "@/components/marketing/auth-shell";
import {
  buttonClass,
  errorClass,
  inputClass,
  labelClass,
  mutedClass,
} from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const callbackUrl = useSearchParams().get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        setError("Incorrect email or password.");
        return;
      }

      router.push(callbackUrl);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <p className={errorClass}>{error}</p> : null}

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass}
        />
      </div>

      <button type="submit" disabled={submitting} className={buttonClass}>
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

function LoginFallback() {
  return <p className={mutedClass}>Loading sign in...</p>;
}

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your week"
      subtitle="Pick up the schedule, clients, and bookings exactly where you left them."
      imageSrc="/marketing/cta-salon.png"
      imageAlt="Quiet salon lounge at dusk"
      panelTitle="Your calendar, already paid."
      panelBody="Appointments only appear after Stripe confirms. No ghosts on the board."
      footer={
        <>
          Need an account? <AuthLink href="/signup">Create one free</AuthLink>
        </>
      }
    >
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
