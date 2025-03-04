import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: true,
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/api/backend/:path*', // Match API requests
                destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`, // Proxy to local backend using env variable
            },
        ];
    },
};

export default nextConfig;
