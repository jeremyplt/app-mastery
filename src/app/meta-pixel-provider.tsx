"use client";

import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { persistFbclid } from "@/lib/meta-pixel";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Mesure la part de visiteurs dont le pixel Meta est bloqué (adblocker,
// Firefox strict...). PostHog passe par le proxy /ingest donc survit là où
// le pixel meurt : l'événement quantifie ce que la CAPI serveur rattrape.
// Détection : le vrai fbevents.js définit fbq.callMethod ; le stub du
// snippet ne l'a pas. 6s après le montage, stub seul = script bloqué.
function MetaPixelBlockedCheck() {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (sessionStorage.getItem("meta_pixel_checked")) return;
        sessionStorage.setItem("meta_pixel_checked", "1");
        const fbq = window.fbq as unknown as { callMethod?: unknown } | undefined;
        const blocked = !fbq || typeof fbq.callMethod !== "function";
        if (blocked) posthog.capture("meta_pixel_blocked");
      } catch {
        // sessionStorage indisponible (navigation privée stricte) : on ignore.
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

// PageView manuel aux navigations SPA (App Router : le snippet de base ne se
// recharge pas entre les pages). Le PageView du chargement initial est envoyé
// par le snippet lui-même : au premier rendu, window.fbq n'existe pas encore
// (script afterInteractive), l'effet ne peut donc pas s'en charger.
function MetaPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!pathname) return;
    // Persiste le fbclid des pubs Meta avant tout événement (cookie _fbc 90j).
    persistFbclid(searchParams.get("fbclid"));
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    if (window.fbq) window.fbq("track", "PageView");
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixelProvider() {
  if (!PIXEL_ID) return null;

  return (
    <>
      {/* Init uniquement : le PageView est géré par MetaPixelPageView pour
          couvrir les navigations client sans doubler le premier chargement. */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');
fbq('track','PageView');
`,
        }}
      />
      <Suspense fallback={null}>
        <MetaPixelPageView />
      </Suspense>
      <MetaPixelBlockedCheck />
    </>
  );
}
