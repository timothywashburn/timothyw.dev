import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === "/pit") {
        const hasPassword = request.cookies.has("pit_access")

        if (!hasPassword) {
            return NextResponse.redirect(new URL("/pit/auth", request.url))
        }
    }
}

export const config = {
    matcher: "/pit"
}