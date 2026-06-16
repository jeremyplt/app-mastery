import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
      {
        source: "/ingest/e",
        destination: "https://us.i.posthog.com/e",
      },
      {
        source: "/ingest/e/:path*",
        destination: "https://us.i.posthog.com/e/:path*",
      },
      {
        source: "/ingest/flags",
        destination: "https://us.i.posthog.com/flags",
      },
      {
        source: "/ingest/flags/:path*",
        destination: "https://us.i.posthog.com/flags/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      // Homepage -> formulaire de qualification (temporaire, 307)
      {
        source: "/",
        destination: "/candidature",
        permanent: false,
      },
      // Anciennes URLs systeme.io -> nouvelles URLs
      {
        source: "/piscine-epitech",
        destination: "/guide/piscine-epitech",
        permanent: true,
      },
      {
        source: "/prompt-50-saas",
        destination: "/guide/prompt-50-saas",
        permanent: true,
      },
      {
        source: "/workflow-make",
        destination: "/guide/workflow-make",
        permanent: true,
      },
      {
        source: "/openclaw",
        destination: "/guide/openclaw",
        permanent: true,
      },
      {
        source: "/monetisation",
        destination: "/guide/monetisation",
        permanent: true,
      },
      {
        source: "/monetisation-merci",
        destination: "/guide/monetisation/merci",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
