import type { Metadata } from "next"
import "./globals.css"
import { ToastProvider } from "@/components/ui/Toast"

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
        <body className="antialiased">
        <ToastProvider>
            {children}
        </ToastProvider>
        </body>
        </html>
    )
}