import { Trash2, RefreshCw, Pencil } from "lucide-react"
import { BackupMetadata } from "@/lib/services/backupService"

interface BackupListItemProps {
    backup: BackupMetadata
    onRename: (backup: BackupMetadata) => void
    onRestore: (backup: BackupMetadata) => void
    onDelete: (backup: BackupMetadata) => void
}

export default function BackupListItem({
    backup,
    onRename,
    onRestore,
    onDelete
}: BackupListItemProps) {
    return (
        <div className="p-4 flex items-center justify-between">
            <div>
                <h3 className="font-medium">{backup.name}</h3>
                <p className="text-sm text-gray-500">
                    Created: {new Date(backup.createdAt).toLocaleString()}
                    {" · "}
                    Size: {(backup.size / 1024 / 1024).toFixed(2)} MB
                    {" · "}
                    Documents: {backup.documentCount.toLocaleString()}
                </p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onRename(backup)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="Rename backup"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onRestore(backup)}
                    className="p-2 text-blue-500 hover:text-blue-700"
                    title="Restore backup"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(backup)}
                    className="p-2 text-red-500 hover:text-red-700"
                    title="Delete backup"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}