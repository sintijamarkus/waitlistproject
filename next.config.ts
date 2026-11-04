import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev "N" ikona apakšējā stūrī aizsedza telefona "Join" joslu.
  devIndicators: false,
  images: {
    // Google profila bildes nāk no šī domēna — bez šī next/image met kļūdu.
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
};

export default nextConfig;
