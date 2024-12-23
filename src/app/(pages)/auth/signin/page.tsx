"use client"

import { signIn } from "next-auth/react"
import { SessionProvider } from "next-auth/react"

function SignInContent() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <button
                onClick={() => signIn("google", { callbackUrl: "/admin/pit" })}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Sign in with Google
            </button>
        </div>
    )
}

export default function SignInPage() {
    return (
        <SessionProvider>
            <SignInContent />
        </SessionProvider>
    )
}