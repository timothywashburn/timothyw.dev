"use client"

import Timeline from "@/components/pit/Timeline"
import TimelineEditor from "@/components/pit/TimelineEditor"
import { useState } from "react"
import { TimelineEntry } from "@/types/pit"

export default function AdminPitContent() {
    const [isEditing, setIsEditing] = useState(false)
    const [editingEntry, setEditingEntry] = useState<TimelineEntry | undefined>()

    async function handleSave(entry: TimelineEntry) {
        const method = entry._id ? "PUT" : "POST"
        const url = entry._id ? `/api/pit/timeline/${entry._id}` : "/api/pit/timeline/create"

        await fetch(url, {
            method,
            body: JSON.stringify(entry),
            headers: {
                "Content-Type": "application/json"
            }
        })

        setIsEditing(false)
        setEditingEntry(undefined)
        // Could add a refresh function here
    }

    if (isEditing) {
        return (
            <TimelineEditor
                entry={editingEntry}
                onSave={handleSave}
                onCancel={() => {
                    setIsEditing(false)
                    setEditingEntry(undefined)
                }}
            />
        )
    }

    return (
        <div>
            <div className="p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Pit Timeline Admin</h1>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Add Entry
                </button>
            </div>
            <Timeline />
        </div>
    )
}