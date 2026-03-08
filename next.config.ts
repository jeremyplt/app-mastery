import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
