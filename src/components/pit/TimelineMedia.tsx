"use client"

import Image from "next/image"
import { Media } from "@/types/pit"
import { useState } from "react"

interface TimelineMediaProps {
    media: Media[]
}

export default function TimelineMedia({ media }: TimelineMediaProps) {
    const [error, setError] = useState<Record<string, boolean>>({})

    if (!media?.length) return null

    return (
        <div className="space-y-4 mt-4">
            {media.map((item) => (
                <div key={item._id.toString()} className="rounded-lg overflow-hidden">
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
                        <p className="mt-2 text-sm text-gray-500">{item.caption}</p>
                    )}
                </div>
            ))}
        </div>
    )
}