"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { persistFbclid } from "@/lib/meta-pixel";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// PageView manuel à chaque navigation (App Router = SPA, le snippet de base ne
// se recharge pas entre les pages). Même pattern que PostHogPageView.
function MetaPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    // Persiste le fbclid des pubs Meta avant tout événement (cookie _fbc 90j).
    persistFbclid(searchParams.get("fbclid"));
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
`,
        }}
      />
      <Suspense fallback={null}>
        <MetaPixelPageView />
      </Suspense>
    </>
  );
}
