import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import AdminPitContent from "./AdminPitContent"

export default async function AdminPitPage() {
    return <AdminPitContent />
}