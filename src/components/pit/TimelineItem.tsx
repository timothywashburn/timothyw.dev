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
    side: "left" | "right"
}

export default function TimelineItem({ entry, index, isAdmin, onEdit, onDelete, side }: TimelineItemProps) {
    const isLeft = side === "left"

    const containerClasses = `
        relative flex items-center gap-4
        ${isLeft ? "flex-row" : "flex-row-reverse"}
        mb-12
    `

    const contentClasses = `
        w-[calc(50%-2rem)] bg-white rounded-lg shadow 
        transition-transform duration-200 hover:-translate-y-1
    `

    return (
        <div className={containerClasses}>
            <div className={contentClasses}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6"
                >
                    <h3 className="text-xl font-semibold text-gray-900">
                        {entry.title}
                    </h3>

                    <time className="block text-blue-500 text-sm mt-1">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </time>

                    {entry.description && (
                        <p className="text-gray-600 mt-3">{entry.description}</p>
                    )}

                    {entry.media?.length > 0 && (
                        <div className="space-y-4 mt-4">
                            {entry.media.map((media) => (
                                <div key={media._id.toString()} className="rounded-lg overflow-hidden">
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

                    <div className="flex flex-wrap gap-2 mt-4">
                        {entry.tags?.map((tag) => (
                            <span
                                key={tag}
                                className="text-sm text-blue-600"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {isAdmin && (
                        <div className="flex gap-4 mt-4 pt-4 border-t">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(entry)}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(entry._id.toString())}
                                className="text-red-600 hover:text-red-700 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2">
                <div className="relative">
                    <div className="absolute top-1/2 -translate-y-1/2 w-16 h-0.5 bg-blue-500"
                         style={{
                             left: isLeft ? "0.5rem" : "auto",
                             right: isLeft ? "auto" : "0.5rem"
                         }}
                    />
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                </div>
            </div>
        </div>
    )
}