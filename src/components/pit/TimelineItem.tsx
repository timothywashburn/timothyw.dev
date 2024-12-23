"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { TimelineEntry } from "@/types/pit"
import TimelineCard from "./TimelineCard"
import TimelineConnector from "./TimelineConnector"
import TimelineMedia from "./TimelineMedia"

interface TimelineItemProps {
    entry: TimelineEntry
    index: number
    isAdmin: boolean
    onEdit?: (entry: TimelineEntry) => void
    onDelete: (id: string) => void
    side: "left" | "right"
    isFirst: boolean
    isLast: boolean
    isExpanded: boolean
    onExpand: (id: string) => void
}

export default function TimelineItem({
                                         entry,
                                         index,
                                         isAdmin,
                                         onEdit,
                                         onDelete,
                                         side,
                                         isFirst,
                                         isLast,
                                         isExpanded,
                                         onExpand
                                     }: TimelineItemProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onExpand(entry._id.toString())
    }

    const content = (
        <TimelineCard side={side} onClick={handleClick}>
            <Content
                entry={entry}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onDelete={onDelete}
                isExpanded={isExpanded}
            />
        </TimelineCard>
    )

    return (
        <div className="grid grid-cols-[1fr,auto,1fr] items-stretch">
            <div className={side === "left" ? "pr-8" : ""}>
                {side === "left" && content}
            </div>

            <TimelineConnector isFirst={isFirst} isLast={isLast} />

            <div className={side === "right" ? "pl-8" : ""}>
                {side === "right" && content}
            </div>
        </div>
    )
}

function Content({ entry, isAdmin, onEdit, onDelete, isExpanded }: {
    entry: TimelineEntry
    isAdmin: boolean
    onEdit?: (entry: TimelineEntry) => void
    onDelete: (id: string) => void
    isExpanded: boolean
}) {
    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
                {entry.description && (
                    <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                        }`}
                    />
                )}
            </div>

            <time className="block text-blue-500 text-sm mt-1">
                {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </time>

            {entry.description && (
                <motion.div
                    initial={false}
                    animate={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <p className="text-gray-600 mt-3">{entry.description}</p>
                </motion.div>
            )}

            <TimelineMedia media={entry.media || []} />

            <div className="flex flex-wrap gap-2 mt-4">
                {entry.tags?.map((tag) => (
                    <span key={tag} className="text-sm text-blue-600">#{tag}</span>
                ))}
            </div>

            {isAdmin && (
                <div className="flex gap-4 mt-4 pt-4 border-t" onClick={handleButtonClick}>
                    {onEdit && <button onClick={() => onEdit(entry)} className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>}
                    <button onClick={() => onDelete(entry._id.toString())} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                </div>
            )}
        </>
    )
}