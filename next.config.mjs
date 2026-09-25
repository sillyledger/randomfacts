/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Don't reuse cached dynamic pages on in-app navigation, so Home reshuffles every visit.
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
