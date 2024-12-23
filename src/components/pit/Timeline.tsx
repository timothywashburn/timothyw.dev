"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { TimelineEntry } from "@/types/pit"
import { timelineService } from "@/lib/services/timelineService"
import TimelineItem from "./TimelineItem"

interface TimelineProps {
    onEdit?: (entry: TimelineEntry) => void;
}

export default function Timeline({ onEdit }: TimelineProps) {
    const [entries, setEntries] = useState<TimelineEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const pathname = usePathname()
    const isAdmin = pathname.startsWith("/admin")

    useEffect(() => {
        fetchEntries()
    }, [])

    async function fetchEntries() {
        try {
            const data = await timelineService.fetchEntries()
            setEntries(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this entry?")) return
        try {
            await timelineService.deleteEntry(id)
            await fetchEntries()
        } catch (err) {
            console.error("delete error:", err)
        }
    }

    if (loading) return (
        <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (error) return (
        <div className="text-red-500 p-4 text-center">Error: {error}</div>
    )

    if (!entries.length) return (
        <div className="text-gray-500 p-4 text-center">No entries found</div>
    )

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-2">Pit Journey Timeline</h1>
            <p className="text-gray-600 text-center mb-12">A chronicle of my adventures and achievements in Hypixel's Pit</p>

            <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[5px] top-0 bottom-0 w-px bg-gray-200" />

                {/* Timeline items */}
                <div className="relative">
                    {entries.map((entry, index) => (
                        <TimelineItem
                            key={entry._id.toString()}
                            entry={entry}
                            index={index}
                            isAdmin={isAdmin}
                            onEdit={onEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}