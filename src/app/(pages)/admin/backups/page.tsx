import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import AdminBackupsContent from "./AdminBackupsContent"

export default async function AdminBackupsPage() {
    return <AdminBackupsContent />
}