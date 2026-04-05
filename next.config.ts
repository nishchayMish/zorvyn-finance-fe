import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://zorvyn-finance-be.onrender.com/api/:path*',
          },
        ]
      },
};

export default nextConfig;
