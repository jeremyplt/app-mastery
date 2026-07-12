"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    capture_pageview: false, // We capture manually to track route changes
    capture_pageleave: true,
    // Params d'ads custom (ad = variante, hook = accroche) traités comme des
    // UTM : propriétés sur les événements + propriétés initiales de la personne.
    custom_campaign_params: ["ad", "hook"],
  });
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!ph || !pathname) return;

    let url = window.origin + pathname;
    const search = searchParams.toString();
    if (search) url += "?" + search;

    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  return null;
}

function PostHogOutboundTracker() {
  const pathname = usePathname();
  const ph = usePostHog();

  useEffect(() => {
    if (!ph) return;

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.href;

      if (href.includes("calendly.com")) {
        ph.capture("calendly_click", { source: pathname });
      } else if (href.includes("wa.me")) {
        ph.capture("whatsapp_click", { source: pathname });
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [ph, pathname]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
        <PostHogOutboundTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
