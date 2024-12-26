"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, RefreshCw, Pencil } from "lucide-react"
import { useToast } from "@/components/ui/Toast"
import { BackupMetadata } from "@/lib/services/backupService"
import FormModal from "@/components/ui/modal/FormModal"
import DeleteModal from "@/components/ui/modal/DeleteModal"

export default function AdminBackupsContent() {
    const [backups, setBackups] = useState<BackupMetadata[]>([])
    const [loading, setLoading] = useState(true)
    const [createModal, setCreateModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, backup?: BackupMetadata}>({ isOpen: false })
    const [renameModal, setRenameModal] = useState<{isOpen: boolean, backup?: BackupMetadata}>({ isOpen: false })
    const [newBackupName, setNewBackupName] = useState("")
    const [newName, setNewName] = useState("")
    const { showToast } = useToast()

    useEffect(() => {
        fetchBackups()
    }, [])

    async function fetchBackups() {
        try {
            const response = await fetch("/api/admin/backups")
            if (!response.ok) throw new Error("Failed to fetch backups")
            const data = await response.json()
            setBackups(data)
        } catch (error) {
            showToast("Failed to load backups", "error")
        } finally {
            setLoading(false)
        }
    }

    async function handleCreateBackup(e: React.FormEvent) {
        e.preventDefault()
        setCreateModal(false)

        try {
            const response = await fetch("/api/admin/backups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create", name: newBackupName }),
            })

            if (!response.ok) throw new Error("Failed to create backup")
            showToast("Backup created successfully", "success")
            await fetchBackups()
        } catch (error) {
            showToast("Failed to create backup", "error")
        }

        setNewBackupName("")
    }

    async function handleRestoreBackup(backup: BackupMetadata) {
        const confirmed = window.confirm(
            "Are you sure you want to restore this backup? This will overwrite all current data."
        )

        if (!confirmed) return

        try {
            const response = await fetch("/api/admin/backups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "restore", name: backup.name }),
            })

            if (!response.ok) throw new Error("Failed to restore backup")
            showToast("Backup restored successfully", "success")
        } catch (error) {
            showToast("Failed to restore backup", "error")
        }
    }

    async function handleDeleteBackup() {
        if (!deleteModal.backup) return

        try {
            const response = await fetch("/api/admin/backups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "delete", name: deleteModal.backup.name }),
            })

            if (!response.ok) throw new Error("Failed to delete backup")
            showToast("Backup deleted successfully", "success")
            await fetchBackups()
        } catch (error) {
            showToast("Failed to delete backup", "error")
        }

        setDeleteModal({ isOpen: false })
    }

    async function handleRenameBackup(e: React.FormEvent) {
        e.preventDefault()
        if (!renameModal.backup) return

        try {
            const response = await fetch("/api/admin/backups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "rename",
                    name: renameModal.backup.name,
                    newName
                }),
            })

            if (!response.ok) throw new Error("Failed to rename backup")
            showToast("Backup renamed successfully", "success")
            await fetchBackups()
        } catch (error) {
            showToast("Failed to rename backup", "error")
        }

        setRenameModal({ isOpen: false })
        setNewName("")
    }

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Database Backups
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage MongoDB backups
                            </p>
                        </div>
                        <button
                            onClick={() => setCreateModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Backup
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="divide-y">
                        {backups.map((backup) => (
                            <div
                                key={backup.name}
                                className="p-4 flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-medium">{backup.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Created: {new Date(backup.createdAt).toLocaleString()}
                                        {" · "}
                                        Size: {(backup.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setRenameModal({ isOpen: true, backup })}
                                        className="p-2 text-gray-500 hover:text-gray-700"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleRestoreBackup(backup)}
                                        className="p-2 text-blue-500 hover:text-blue-700"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteModal({ isOpen: true, backup })}
                                        className="p-2 text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {backups.length === 0 && (
                            <p className="p-4 text-center text-gray-500">
                                No backups found
                            </p>
                        )}
                    </div>
                </div>
            </main>

            <FormModal
                isOpen={createModal}
                onClose={() => setCreateModal(false)}
                title="Create Backup"
                description="Create a new backup of the current database state"
            >
                <form id="modal-form" onSubmit={handleCreateBackup}>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Backup Name
                        </label>
                        <input
                            type="text"
                            value={newBackupName}
                            onChange={(e) => setNewBackupName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                </form>
            </FormModal>

            <FormModal
                isOpen={renameModal.isOpen}
                onClose={() => setRenameModal({ isOpen: false })}
                title="Rename Backup"
                description="Enter a new name for the backup"
            >
                <form id="modal-form" onSubmit={handleRenameBackup}>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            New Name
                        </label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                </form>
            </FormModal>

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false })}
                onConfirm={handleDeleteBackup}
                title="Delete Backup"
                description="Are you sure you want to delete this backup? This action cannot be undone."
            />
        </div>
    )
}