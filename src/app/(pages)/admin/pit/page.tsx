import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import AdminPitContent from "./AdminPitContent"

export default async function AdminPitPage() {
    const session = await auth()

    if (!session) {
        redirect("/auth/signin")
    }

    return <AdminPitContent />
}