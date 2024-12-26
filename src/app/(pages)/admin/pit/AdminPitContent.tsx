"use client";

import Timeline from "@/components/pit/Timeline";
import TimelineEditor from "@/components/pit/TimelineEditor";
import TimelineHeader from "@/components/admin/pit/TimelineHeader";
import { useState } from "react";
import { TimelineEntry } from "@/types/pit";

export default function AdminPitContent() {
    const [isEditing, setIsEditing] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TimelineEntry | undefined>();
    const [key, setKey] = useState(0);

    function handleEdit(entry: TimelineEntry) {
        setEditingEntry(entry);
        setIsEditing(true);
    }

    function handleSaveComplete() {
        setIsEditing(false);
        setEditingEntry(undefined);
        setKey(prev => prev + 1);
    }

    function handleClose() {
        setIsEditing(false);
        setEditingEntry(undefined);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TimelineHeader onAddEntry={() => setIsEditing(true)} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Timeline key={key} onEdit={handleEdit} />
            </div>

            <TimelineEditor
                isOpen={isEditing}
                entry={editingEntry}
                onClose={handleClose}
                onSaveComplete={handleSaveComplete}
            />
        </div>
    );
}