const requiredEnvs = {
    MONGODB_URI: process.env.MONGODB_URI!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    PIT_ACCESS_PASSWORD: process.env.PIT_ACCESS_PASSWORD!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!
} as const

// Only validate environment variables at runtime, not during build
// Skip validation during Next.js build phase
if (process.env.NEXT_PHASE !== 'phase-production-build') {
    Object.entries(requiredEnvs).forEach(([key, value]) => {
        if (!value) throw new Error(`Missing required environment variable: ${key}`)
    })
}

export const env = requiredEnvs