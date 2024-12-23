import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { env } from "@/env"
import { getServerSession } from "next-auth"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        })
    ],
    pages: {
        signIn: "/auth/signin"
    },
    callbacks: {
        async signIn({ account, profile }) {
            return profile?.email === "timothyrwashburn@gmail.com"
        },
        async session({ session, token }) {
            return session
        },
    }
}

export const auth = () => getServerSession(authOptions);