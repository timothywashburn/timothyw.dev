import { NextConfig } from 'next'

const config: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        domains: [process.env.VERCEL_URL || 'localhost']
    }
}

export default config