import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import AdminNav from "@/components/admin/navigation/AdminNav"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/auth/signin")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNav />
            {children}
        </div>
    )
}