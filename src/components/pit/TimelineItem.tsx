"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { TimelineEntry } from "@/types/pit"

interface TimelineItemProps {
    entry: TimelineEntry
    index: number
    isAdmin: boolean
    onEdit?: (entry: TimelineEntry) => void
    onDelete: (id: string) => void
}

export default function TimelineItem({ entry, index, isAdmin, onEdit, onDelete }: TimelineItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-6 mb-8 last:mb-0"
        >
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-blue-500" />

            <div className="flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {entry.title}
                </h3>

                {entry.description && (
                    <p className="text-gray-600 mb-2">{entry.description}</p>
                )}

                {entry.media?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                        {entry.media.map((media) => (
                            <div key={media._id.toString()} className="relative rounded-lg overflow-hidden">
                                {media.type === "image" ? (
                                    <div className="aspect-video relative">
                                        <Image
                                            src={media.url}
                                            alt={media.caption || ""}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <iframe
                                        src={media.url}
                                        title={media.caption || "YouTube video"}
                                        className="w-full aspect-video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                )}
                                {media.caption && (
                                    <p className="mt-2 text-sm text-gray-500">
                                        {media.caption}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3">
                        {entry.tags && entry.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-sm text-gray-500"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <time className="text-sm text-gray-500">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </time>

                        {isAdmin && (
                            <div className="flex gap-4">
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(entry)}
                                        className="text-blue-500 hover:text-blue-600 text-sm"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(entry._id.toString())}
                                    className="text-red-500 hover:text-red-600 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}