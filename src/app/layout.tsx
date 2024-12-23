import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
    title: "Timothy Washburn",
    description: "Personal website of Timothy Washburn",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className="antialiased">{children}</body>
        </html>
    )
}