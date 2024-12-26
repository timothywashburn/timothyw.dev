import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import AdminDashboardContent from "./AdminDashboardContent"

export default async function AdminDashboardPage() {
    const session = await auth()

    if (!session) {
        redirect("/auth/signin")
    }

    return <AdminDashboardContent />
}