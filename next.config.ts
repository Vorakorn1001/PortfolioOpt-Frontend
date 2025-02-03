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
                destination: 'http://poppytaro.trueddns.com:41165/:path*', // Proxy to local backend
            },
        ];
    },
};

export default nextConfig;
