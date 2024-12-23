import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { password } = await req.json()

    if (password === process.env.PIT_ACCESS_PASSWORD) {
        const response = new NextResponse(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        })

        response.cookies.set("pit_access", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        })

        return response
    }

    return new NextResponse("Unauthorized", { status: 401 })
}