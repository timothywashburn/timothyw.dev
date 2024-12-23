"use client"

import Timeline from "@/components/pit/Timeline"
import TimelineEditor from "@/components/pit/TimelineEditor"
import { Plus } from "lucide-react"
import { useState } from "react"
import { TimelineEntry } from "@/types/pit"
import FormModal from "@/components/ui/modal/FormModal";

export default function AdminPitContent() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingEntry, setEditingEntry] = useState<TimelineEntry | undefined>()
    const [key, setKey] = useState(0)

    async function handleSave(entry: TimelineEntry) {
        setIsModalOpen(false)
        setEditingEntry(undefined)
        setKey(prev => prev + 1)
    }

    function handleEdit(entry: TimelineEntry) {
        setEditingEntry(entry)
        setIsModalOpen(true)
    }

    const handleClose = () => {
        setIsModalOpen(false)
        setEditingEntry(undefined)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Modern Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Pit Timeline Admin
                            </h1>
                            <p className="text-sm font-medium text-gray-500">
                                Manage and edit timeline entries
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                     text-white font-medium rounded-lg transition-colors gap-2 shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Entry</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Timeline key={key} onEdit={handleEdit} />
            </div>

            <FormModal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={editingEntry ? "Edit Entry" : "Add New Entry"}
                description={editingEntry
                    ? "Make changes to your timeline entry below"
                    : "Create a new timeline entry with the form below"}
            >
                <TimelineEditor
                    entry={editingEntry}
                    onSave={handleSave}
                    onCancel={handleClose}
                />
            </FormModal>
        </div>
    )
}