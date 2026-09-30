"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { SignupBrand, SignupFrame } from "@/components/marketing/signup-frame";
import { INDUSTRIES } from "@/lib/industries";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";

const labelClass = "block text-sm font-medium text-ink";
const inputClass =
  "mt-1 w-full rounded-lg border-0 bg-[#dce2d4] px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink/40 focus:ring-2 focus:ring-moss";
const hintClass = "mt-1 text-xs text-ink/55";
const ctaClass =
  "inline-flex w-full items-center justify-center rounded-md bg-moss px-4 py-3 text-sm font-semibold text-ink transition hover:bg-moss-light disabled:opacity-50";
const errorBox =
  "rounded-md border border-red-700/20 bg-red-50 px-3 py-2 text-sm text-red-800";

type Step = "account" | "business" | "creating";

function browserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York";
  }
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function goToBusiness(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setStep("business");
  }

  async function createAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    setStep("creating");

    const started = Date.now();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          businessName,
          location,
          industry,
          timezone: browserTimezone(),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        const message = data?.error ?? "Could not create your account.";
        setError(message);
        setStep(
          message.toLowerCase().includes("email") ? "account" : "business",
        );
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      const elapsed = Date.now() - started;
      if (elapsed < 900) {
        await new Promise((resolve) => setTimeout(resolve, 900 - elapsed));
      }

      if (result?.error) {
        setError("Account created, but sign in failed. Try logging in.");
        setStep("account");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setStep("business");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SignupFrame>
      <SignupBrand />

      {step === "creating" ? (
        <div className="flex flex-col items-center py-10 text-center">
          <span
            className="h-12 w-12 animate-spin rounded-full border-[3px] border-moss/25 border-t-moss"
            aria-hidden
          />
          <h1 className="mt-8 text-xl font-semibold tracking-tight">
            Creating your account...
          </h1>
          <p className="mt-2 max-w-sm text-sm text-ink/60">
            Hang tight. We&apos;re setting up your account and booking page,
            then you&apos;ll land on the dashboard.
          </p>
        </div>
      ) : null}

      {step === "account" ? (
        <>
          <h1 className="text-3xl font-semibold tracking-tight">
            Start your{" "}
            <span className="relative inline-block">
              free trial
              <span
                className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-moss"
                aria-hidden
              />
            </span>
          </h1>
          <p className="mt-3 text-sm text-ink/65">
            Try ServiceBooker free for 14 days.
            <br />
            No credit card required.
          </p>

          <form onSubmit={goToBusiness} className="mt-8 space-y-4">
            {error ? <p className={errorBox}>{error}</p> : null}

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
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={MIN_PASSWORD_LENGTH}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border-0 bg-[#dce2d4] px-3.5 py-2.5 pr-12 text-sm text-ink outline-none placeholder:text-ink/40 focus:ring-2 focus:ring-moss"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-ink/55 hover:text-ink"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className={hintClass}>
                Password must be at least {MIN_PASSWORD_LENGTH} characters
              </p>
            </div>

            <button type="submit" className={ctaClass}>
              Continue
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/60">
            Already using ServiceBooker?{" "}
            <Link
              href="/login"
              className="font-medium text-ink underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </>
      ) : null}

      {step === "business" ? (
        <>
          <h1 className="text-3xl font-semibold tracking-tight">
            Tell us about your business
          </h1>
          <p className="mt-3 text-sm text-ink/65">
            A few details so your booking page has a name and a timezone.
          </p>

          <form onSubmit={createAccount} className="mt-8 space-y-4">
            {error ? <p className={errorBox}>{error}</p> : null}

            <div>
              <label htmlFor="name" className={labelClass}>
                Your name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                placeholder="ex. Maya Chen"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="businessName" className={labelClass}>
                Company name
              </label>
              <input
                id="businessName"
                type="text"
                autoComplete="organization"
                required
                placeholder="ex. North Studio"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>
                Where is your business located?
              </label>
              <input
                id="location"
                type="text"
                autoComplete="address-level2"
                required
                placeholder="Enter a city or neighborhood"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className={inputClass}
              />
              <p className={hintClass}>
                Booking times use your timezone. You can change hours after you
                sign up.
              </p>
            </div>

            <div>
              <label htmlFor="industry" className={labelClass}>
                What industry are you in?
              </label>
              <select
                id="industry"
                required
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Select industry
                </option>
                {INDUSTRIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={submitting} className={ctaClass}>
              Start free trial
            </button>
            <button
              type="button"
              className="w-full text-center text-sm text-ink/55 hover:text-ink"
              onClick={() => {
                setError(null);
                setStep("account");
              }}
            >
              Back
            </button>
          </form>
        </>
      ) : null}
    </SignupFrame>
  );
}
