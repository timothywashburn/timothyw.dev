import { useState } from "react"
import { TimelineEntry, Media } from "@/types/pit"

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
    const [uploading, setUploading] = useState(false)
    const [media, setMedia] = useState<Media[]>(entry?.media || [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const formData = {
            _id: entry?._id,
            title,
            date: new Date(date),
            description,
            tags: tags.split(",").map(t => t.trim()).filter(Boolean),
            media,
            createdAt: entry?.createdAt || new Date(),
            updatedAt: new Date()
        }

        onSave(formData as TimelineEntry)
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length) return

        setUploading(true)
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("file", file)
        formData.append("timelineEntryId", entry?._id || "temp")

        try {
            const res = await fetch("/api/pit/media", {
                method: "POST",
                body: formData
            })

            if (!res.ok) throw new Error("Upload failed")

            const newMedia = await res.json()
            setMedia([...media, newMedia])
        } catch (error) {
            console.error("Upload error:", error)
        } finally {
            setUploading(false)
        }
    }

    async function handleMediaDelete(mediaId: string) {
        try {
            await fetch("/api/pit/media", {
                method: "DELETE",
                body: JSON.stringify({ _id: mediaId })
            })
            setMedia(media.filter(m => m._id !== mediaId))
        } catch (error) {
            console.error("Delete error:", error)
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
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md h-32"
                    required
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

            <div>
                <label className="block text-sm font-medium mb-2">Media</label>
                <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*"
                    disabled={uploading}
                    className="mb-4"
                />

                <div className="grid grid-cols-2 gap-4">
                    {media.map(item => (
                        <div key={item._id} className="relative">
                            <img
                                src={item.url}
                                alt={item.caption || ""}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => handleMediaDelete(item._id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
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