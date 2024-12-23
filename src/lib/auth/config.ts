import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { env } from "@/env"
import { getServerSession } from "next-auth"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error"
    },
    callbacks: {
        async signIn({ account, profile }) {
            if (profile?.email !== "timothyrwashburn@gmail.com") {
                throw new Error("Unauthorized email")
            }
            return true
        },
        async session({ session, token }) {
            return session
        },
    }
}

export const auth = () => getServerSession(authOptions);