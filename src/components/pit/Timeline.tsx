import { useState, useEffect } from "react"
import Image from "next/image"
import { TimelineEntry } from "@/types/pit"
import { usePathname } from "next/navigation"
import {ObjectId} from "mongodb";

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
            const res = await fetch("/api/pit/timeline")
            if (!res.ok) throw new Error("Failed to fetch timeline")
            const data = await res.json()
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
            const res = await fetch("/api/pit/timeline", {
                method: "DELETE",
                body: JSON.stringify({ _id: id })
            })
            if (!res.ok) throw new Error("Failed to delete entry")
            await fetchEntries()
        } catch (err) {
            console.error("delete error:", err)
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!entries.length) return <div>No entries found</div>

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="space-y-8">
                {entries.map((entry) => (
                    <div key={entry._id.toString()} className="border rounded-lg p-6 bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold">{entry.title}</h2>
                            <div className="flex items-center gap-4">
                                <time className="text-sm text-gray-500">
                                    {new Date(entry.date).toLocaleDateString()}
                                </time>
                                {isAdmin && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(entry._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(entry)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="mb-4 text-gray-700 dark:text-gray-300">{entry.description}</p>

                        {entry.media?.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                {entry.media.map((media) => (
                                    <div key={media._id.toString()} className="relative">
                                        {media.type === "image" ? (
                                            <Image
                                                src={media.url}
                                                alt={media.caption || ""}
                                                width={400}
                                                height={300}
                                                className="rounded-lg object-cover"
                                            />
                                        ) : (
                                            <iframe
                                                src={media.url}
                                                title={media.caption || "YouTube video"}
                                                className="w-full aspect-video rounded-lg"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        )}
                                        {media.caption && (
                                            <p className="mt-2 text-sm text-gray-500">{media.caption}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {entry.tags && entry.tags.length > 0 && (
                            <div className="flex gap-2">
                                {entry.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}