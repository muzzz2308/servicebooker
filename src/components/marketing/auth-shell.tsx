import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/marketing/site-header";
import { mutedClass } from "@/components/ui";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  footer,
  imageSrc,
  imageAlt,
  panelTitle,
  panelBody,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: ReactNode;
  imageSrc: string;
  imageAlt: string;
  panelTitle: string;
  panelBody: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink">
      <SiteHeader />
      <div className="grid lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-2">
        <aside className="relative isolate hidden overflow-hidden lg:block">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="text-xs uppercase tracking-[0.28em] text-moss-light">
              {eyebrow}
            </p>
            <p className="mt-4 max-w-md text-3xl font-semibold tracking-tight">
              {panelTitle}
            </p>
            <p className={`mt-3 max-w-sm text-base ${mutedClass}`}>{panelBody}</p>
          </div>
        </aside>

        <div className="relative h-36 overflow-hidden sm:h-44 lg:hidden">
          <Image
            src={imageSrc}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/55" />
          <p className="absolute bottom-4 left-4 right-4 text-sm font-medium">
            {panelTitle}
          </p>
        </div>

        <main className="flex items-center px-page py-10 sm:py-14">
          <div className="mx-auto w-full max-w-md">
            <p className="text-xs uppercase tracking-[0.28em] text-moss-light">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className={`mt-2 ${mutedClass}`}>{subtitle}</p>
            <div className="mt-8">{children}</div>
            <p className={`mt-6 ${mutedClass}`}>{footer}</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export function AuthLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-moss-light underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  );
}
