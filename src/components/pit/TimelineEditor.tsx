"use client"

import { useState } from "react"
import { TimelineEntry, Media } from "@/types/pit"
import { timelineService } from "@/lib/services/timelineService"
import MediaManager from "./TimelineMediaManager"
import { useToast } from "@/components/ui/Toast"

interface Props {
    entry?: TimelineEntry
    onSave: (entry: TimelineEntry) => void
    onCancel: () => void
}

export default function TimelineEditor({ entry, onSave, onCancel }: Props) {
    const { showToast } = useToast()
    const [title, setTitle] = useState(entry?.title || "")
    const [date, setDate] = useState(entry?.date ? new Date(entry.date).toISOString().split("T")[0] : "")
    const [description, setDescription] = useState(entry?.description || "")
    const [tags, setTags] = useState(entry?.tags?.join(", ") || "")
    const [media, setMedia] = useState<Media[]>(entry?.media || [])
    const [saving, setSaving] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        try {
            // Handle media uploads first for any temporary media items
            const processedMedia = await Promise.all(
                media.map(async (item) => {
                    if (item._id.toString().startsWith('temp-') && item.file) {
                        const formData = new FormData()
                        formData.append("file", item.file)
                        formData.append("timelineEntryId", entry?._id?.toString() || "")
                        formData.append("caption", item.caption || "")

                        const response = await fetch("/api/pit/media", {
                            method: "POST",
                            body: formData,
                        })

                        if (!response.ok) {
                            throw new Error("Failed to upload media")
                        }

                        return await response.json()
                    }
                    return item
                })
            )

            // Filter out any failed uploads
            const validMedia = processedMedia.filter(Boolean)

            const entryData: Partial<TimelineEntry> = {
                title,
                date: new Date(date),
                description: description || undefined,
                tags: tags.split(",").map(t => t.trim()).filter(Boolean),
                media: validMedia,
            }

            if (entry?._id) {
                await timelineService.updateEntry({ ...entryData, _id: entry._id } as TimelineEntry)
                onSave({ ...entryData, _id: entry._id } as TimelineEntry)
                showToast('Entry updated successfully', 'success')
            } else {
                const id = await timelineService.createEntry(entryData)
                onSave({ ...entryData, _id: id } as TimelineEntry)
                showToast('Entry created successfully', 'success')
            }
        } catch (error) {
            console.error("error saving entry:", error)
            showToast('Failed to save entry', 'error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form id="modal-form" onSubmit={handleSubmit}>
            <div className="space-y-6">
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

                {entry?._id && (
                    <MediaManager
                        media={media}
                        onMediaChange={setMedia}
                    />
                )}
            </div>
        </form>
    )
}