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
    isFirst: boolean
    isLast: boolean
}

export default function TimelineItem({ entry, index, isAdmin, onEdit, onDelete, side, isFirst, isLast }: TimelineItemProps) {
    const isLeft = side === "left"

    return (
        <div className="grid grid-cols-[1fr,auto,1fr] items-stretch">
            {/* Left content */}
            <div className={isLeft ? "pr-8" : ""}>
                {isLeft && (
                    <div className="bg-white rounded-lg shadow p-6 transition-transform duration-200 hover:-translate-y-1 ml-auto mr-0 max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Content
                                entry={entry}
                                isAdmin={isAdmin}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Center line and dot */}
            <div className="flex flex-col items-center w-4">
                <div className={`w-0.5 h-6 bg-blue-500 mb-2 shrink -0 ${isFirst ? 'opacity-0' : ''}`} />
                <div className="w-3 h-3 bg-blue-500 rounded-full shrink-0" />
                <div className={`w-0.5 bg-blue-500 flex-1 mt-2 ${isLast ? 'opacity-0' : ''}`} />
            </div>

            {/* Right content */}
            <div className={!isLeft ? "pl-8" : ""}>
                {!isLeft && (
                    <div className="bg-white rounded-lg shadow p-6 transition-transform duration-200 hover:-translate-y-1 ml-0 mr-auto max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Content
                                entry={entry}
                                isAdmin={isAdmin}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}

function Content({ entry, isAdmin, onEdit, onDelete }: {
    entry: TimelineEntry
    isAdmin: boolean
    onEdit?: (entry: TimelineEntry) => void
    onDelete: (id: string) => void
}) {
    return (
        <>
            <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
            <time className="block text-blue-500 text-sm mt-1">
                {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </time>
            {entry.description && <p className="text-gray-600 mt-3">{entry.description}</p>}
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
                            {media.caption && <p className="mt-2 text-sm text-gray-500">{media.caption}</p>}
                        </div>
                    ))}
                </div>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
                {entry.tags?.map((tag) => (
                    <span key={tag} className="text-sm text-blue-600">#{tag}</span>
                ))}
            </div>
            {isAdmin && (
                <div className="flex gap-4 mt-4 pt-4 border-t">
                    {onEdit && <button onClick={() => onEdit(entry)} className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>}
                    <button onClick={() => onDelete(entry._id.toString())} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                </div>
            )}
        </>
    )
}