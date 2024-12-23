"use client"

import Image from "next/image"
import { Media } from "@/types/pit"
import { useState } from "react"
import { ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TimelineMediaProps {
    media: Media[]
    isExpanded: boolean
}

export default function TimelineMedia({ media, isExpanded }: TimelineMediaProps) {
    const [error, setError] = useState<Record<string, boolean>>({})

    if (!media?.length) return null

    return (
        <div className="mt-4">
            <AnimatePresence mode="wait">
                {!isExpanded && media.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut"
                        }}
                        className="flex items-center gap-2"
                    >
                        {/* Preview thumbnails */}
                        <div className="flex -space-x-2">
                            {media.slice(0, 3).map((item, index) => (
                                <div
                                    key={item._id.toString()}
                                    className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative bg-gray-100"
                                    style={{ zIndex: 3 - index }}
                                >
                                    {item.type === "image" && !error[item._id.toString()] ? (
                                        <Image
                                            src={item.url}
                                            alt=""
                                            fill
                                            className="object-cover"
                                            onError={() => setError(prev => ({ ...prev, [item._id.toString()]: true }))}
                                            sizes="32px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-4 h-4 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Media count badge */}
                        <span className="text-sm text-gray-500">
                            {media.length} {media.length === 1 ? 'media item' : 'media items'}
                        </span>
                    </motion.div>
                )}

                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut"
                        }}
                        className="space-y-4"
                    >
                        {media.map((item, index) => (
                            <motion.div
                                key={item._id.toString()}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        delay: index * 0.1,
                                        duration: 0.2,
                                        ease: "easeOut"
                                    }
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: {
                                        duration: 0.15,
                                        ease: "easeIn"
                                    }
                                }}
                                className="rounded-lg overflow-hidden bg-gray-50"
                            >
                                {item.type === "image" && !error[item._id.toString()] ? (
                                    <div className="aspect-video relative">
                                        <Image
                                            src={item.url}
                                            alt={item.caption || ""}
                                            fill
                                            className="object-cover"
                                            onError={() => setError(prev => ({ ...prev, [item._id.toString()]: true }))}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                ) : error[item._id.toString()] ? (
                                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-500">Failed to load image</span>
                                    </div>
                                ) : null}
                                {item.caption && (
                                    <div className="p-4">
                                        <p className="text-sm text-gray-600">{item.caption}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}