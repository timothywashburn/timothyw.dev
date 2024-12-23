"use client"

import { useState } from "react"
import { TimelineEntry, Media } from "@/types/pit"
import { timelineService } from "@/lib/services/timelineService"

interface Props {
    entry?: TimelineEntry
    onSave: (entry: TimelineEntry) => void
    onCancel: () => void
}

export default function TimelineEditor({ entry, onSave, onCancel }: Props) {
    const [title, setTitle] = useState(entry?.title || "")
    const [date, setDate] = useState(entry?.date ? new Date(entry.date).toISOString().split("T")[0] : "")
    const [description, setDescription] = useState(entry?.description || "")
    const [tags, setTags] = useState(entry?.tags?.join(", ") || "")
    const [media, setMedia] = useState<Media[]>(entry?.media || [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const entryData: Partial<TimelineEntry> = {
            title,
            date: new Date(date),
            description: description || undefined,
            tags: tags.split(",").map(t => t.trim()).filter(Boolean),
            media,
        }

        try {
            if (entry?._id) {
                await timelineService.updateEntry({ ...entryData, _id: entry._id } as TimelineEntry)
                onSave({ ...entryData, _id: entry._id } as TimelineEntry)
            } else {
                const id = await timelineService.createEntry(entryData)
                onSave({ ...entryData, _id: id } as TimelineEntry)
            }
        } catch (error) {
            console.error("Error saving entry:", error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
            <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md h-32"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="tag1, tag2, tag3"
                />
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}