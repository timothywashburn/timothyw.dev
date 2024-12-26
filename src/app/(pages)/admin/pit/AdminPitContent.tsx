"use client"

import Timeline from "@/components/pit/Timeline"
import TimelineEditor from "@/components/pit/TimelineEditor"
import TimelineHeader from "@/components/admin/pit/TimelineHeader"
import { useState } from "react"
import { TimelineEntry } from "@/types/pit"
import FormModal from "@/components/ui/modal/FormModal"

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
            <TimelineHeader onAddEntry={() => setIsModalOpen(true)} />

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