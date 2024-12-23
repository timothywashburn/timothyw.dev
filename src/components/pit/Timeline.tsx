"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { TimelineEntry } from "@/types/pit"
import { timelineService } from "@/lib/services/timelineService"
import TimelineItem from "./TimelineItem"
import { useToast } from "@/components/ui/Toast"
import DeleteModal from "@/components/ui/modal/DeleteModal"

interface TimelineProps {
    onEdit?: (entry: TimelineEntry) => void
}

export default function Timeline({ onEdit }: TimelineProps) {
    const [entries, setEntries] = useState<TimelineEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        entryId?: string;
    }>({ isOpen: false });
    const pathname = usePathname()
    const isAdmin = pathname.startsWith("/admin")
    const { showToast } = useToast()

    useEffect(() => {
        fetchEntries()
    }, [])

    async function fetchEntries() {
        try {
            const data = await timelineService.fetchEntries()
            setEntries(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
            showToast('Failed to load timeline entries', 'error')
        } finally {
            setLoading(false)
        }
    }

    async function handleDeleteConfirm() {
        if (!deleteModal.entryId) return

        try {
            await timelineService.deleteEntry(deleteModal.entryId)
            await fetchEntries()
            showToast('Entry deleted successfully', 'success')
        } catch (err) {
            console.error("delete error:", err)
            showToast('Failed to delete entry', 'error')
        } finally {
            setDeleteModal({ isOpen: false })
        }
    }

    const handleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id)
    }

    if (loading) return (
        <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (error) return <div className="text-red-500 p-4 text-center">Error: {error}</div>

    if (!entries.length) return <div className="text-gray-500 p-4 text-center">No entries found</div>

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="relative">
                {entries.map((entry, index) => (
                    <TimelineItem
                        key={entry._id.toString()}
                        entry={entry}
                        index={index}
                        isAdmin={isAdmin}
                        onEdit={onEdit}
                        onDelete={() => setDeleteModal({ isOpen: true, entryId: entry._id.toString() })}
                        side={index % 2 === 0 ? "left" : "right"}
                        isFirst={index === 0}
                        isLast={index === entries.length - 1}
                        isExpanded={expandedId === entry._id.toString()}
                        onExpand={handleExpand}
                    />
                ))}
            </div>

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false })}
                onConfirm={handleDeleteConfirm}
                title="Delete Timeline Entry"
                description="Are you sure you want to delete this timeline entry? This action cannot be undone and will remove all associated media."
            />
        </div>
    )
}