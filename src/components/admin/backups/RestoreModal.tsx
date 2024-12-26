import { AlertTriangle } from "lucide-react"
import BaseModal from "@/components/ui/modal/BaseModal"
import { BackupMetadata } from "@/lib/services/backupService"

interface RestoreModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    backup?: BackupMetadata
}

export default function RestoreModal({
    isOpen,
    onClose,
    onConfirm,
    backup
}: RestoreModalProps) {
    if (!backup) return null

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Restore Backup"
            icon={AlertTriangle}
            description={`Are you sure you want to restore the backup "${backup.name}"?`}
        >
            <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Warning
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>This will overwrite all current data</li>
                                    <li>This action cannot be undone</li>
                                    <li>{backup.documentCount.toLocaleString()} documents will be restored</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg"
                    >
                        Restore Backup
                    </button>
                </div>
            </div>
        </BaseModal>
    )
}