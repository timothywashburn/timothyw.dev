"use client";

import React, {useEffect, useState} from "react";
import { useToast } from "@/components/ui/Toast";
import { BackupMetadata } from "@/lib/services/backupService";
import FormModal from "@/components/ui/modal/FormModal";
import DeleteModal from "@/components/ui/modal/DeleteModal";
import BackupListItem from "@/components/admin/backups/BackupListItem";
import BackupsHeader from "@/components/admin/backups/BackupsHeader";
import RestoreModal from "@/components/admin/backups/RestoreModal";
import { CreateBackupForm, RenameBackupForm } from "@/components/admin/backups/BackupForms";

export default function AdminBackupsContent() {
    const [backups, setBackups] = useState<BackupMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [createModal, setCreateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, backup?: BackupMetadata}>({ isOpen: false });
    const [renameModal, setRenameModal] = useState<{isOpen: boolean, backup?: BackupMetadata}>({ isOpen: false });
    const [restoreModal, setRestoreModal] = useState<{isOpen: boolean, backup?: BackupMetadata}>({ isOpen: false });
    const [newBackupName, setNewBackupName] = useState("");
    const [newName, setNewName] = useState("");
    const [isValidNewBackup, setIsValidNewBackup] = useState(false);
    const [isValidRename, setIsValidRename] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchBackups();
    }, []);

    async function fetchBackups() {
        try {
            const response = await fetch("/api/admin/backups");
            if (!response.ok) throw new Error("Failed to fetch backups");
            const data = await response.json();
            setBackups(data);
        } catch (error) {
            showToast("Failed to load backups", "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateBackup(e: React.FormEvent) {
        e.preventDefault();
        setCreateModal(false);

        try {
            const response = await fetch("/api/admin/backups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create", name: newBackupName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                showToast(errorData.message || "Failed to create backup", "error");
                setNewBackupName("");
                setIsValidNewBackup(false);
                return;
            }

            showToast("Backup created successfully", "success");
            await fetchBackups();
        } catch (error) {
            showToast("Failed to create backup", "error");
            setNewBackupName("");
            setIsValidNewBackup(false);
        }

        setNewBackupName("");
        setIsValidNewBackup(false);
    }

    async function handleRestoreBackup() {
        if (!restoreModal.backup) return;

        try {
            const response = await fetch("/api/admin/backups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "restore", name: restoreModal.backup.name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                showToast(errorData.message || "Failed to restore backup", "error");
                return;
            }

            showToast("Backup restored successfully", "success");
        } catch (error) {
            showToast("Failed to restore backup", "error");
        } finally {
            setRestoreModal({ isOpen: false });
        }
    }

    async function handleDeleteBackup() {
        if (!deleteModal.backup) return;

        try {
            const response = await fetch("/api/admin/backups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "delete", name: deleteModal.backup.name }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                showToast(errorData.message || "Failed to delete backup", "error");
                return;
            }

            showToast("Backup deleted successfully", "success");
            await fetchBackups();
        } catch (error) {
            showToast("Failed to delete backup", "error");
        }

        setDeleteModal({ isOpen: false });
    }

    async function handleRenameBackup(e: React.FormEvent) {
        e.preventDefault();
        if (!renameModal.backup) return;

        try {
            const response = await fetch("/api/admin/backups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "rename",
                    name: renameModal.backup.name,
                    newName
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                showToast(errorData.message || "Failed to rename backup", "error");
                setNewName("");
                setIsValidRename(false);
                return;
            }

            showToast("Backup renamed successfully", "success");
            await fetchBackups();
        } catch (error) {
            showToast("Failed to rename backup", "error");
            setNewName("");
            setIsValidRename(false);
        }

        setRenameModal({ isOpen: false });
        setNewName("");
        setIsValidRename(false);
    }

    const handleCreateModalClose = () => {
        setCreateModal(false);
        setNewBackupName("");
        setIsValidNewBackup(false);
    };

    const handleRenameModalClose = () => {
        setRenameModal({ isOpen: false });
        setNewName("");
        setIsValidRename(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <BackupsHeader onCreateClick={() => setCreateModal(true)} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="divide-y">
                        {backups.map((backup) => (
                            <BackupListItem
                                key={backup.name}
                                backup={backup}
                                onRename={(backup) => setRenameModal({ isOpen: true, backup })}
                                onRestore={(backup) => setRestoreModal({ isOpen: true, backup })}
                                onDelete={(backup) => setDeleteModal({ isOpen: true, backup })}
                            />
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
                onClose={handleCreateModalClose}
                onSubmit={handleCreateBackup}
                title="Create Backup"
                description="Create a new backup of the current database state"
                submitText="Create Backup"
                isValid={isValidNewBackup}
            >
                <CreateBackupForm
                    value={newBackupName}
                    onChange={(e) => setNewBackupName(e.target.value)}
                    onValidityChange={setIsValidNewBackup}
                />
            </FormModal>

            <FormModal
                isOpen={renameModal.isOpen}
                onClose={handleRenameModalClose}
                onSubmit={handleRenameBackup}
                title="Rename Backup"
                description="Enter a new name for the backup"
                submitText="Rename Backup"
                isValid={isValidRename}
            >
                <RenameBackupForm
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onValidityChange={setIsValidRename}
                />
            </FormModal>

            <RestoreModal
                isOpen={restoreModal.isOpen}
                onClose={() => setRestoreModal({ isOpen: false })}
                onConfirm={handleRestoreBackup}
                backup={restoreModal.backup}
            />

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false })}
                onConfirm={handleDeleteBackup}
                title="Delete Backup"
                description="Are you sure you want to delete this backup? This action cannot be undone."
            />
        </div>
    );
}