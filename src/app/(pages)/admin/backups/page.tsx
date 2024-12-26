import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import AdminBackupsContent from "./AdminBackupsContent"

export default async function AdminBackupsPage() {
    const session = await auth()

    if (!session) {
        redirect("/auth/signin")
    }

    return <AdminBackupsContent />
}