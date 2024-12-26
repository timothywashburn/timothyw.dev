import { backupService } from "@/lib/services/backupService"
import AdminBackupsContent from "./AdminBackupsContent"

export default async function AdminBackupsPage() {
    const backups = await backupService.listBackups();
    return <AdminBackupsContent initialBackups={backups} />
}