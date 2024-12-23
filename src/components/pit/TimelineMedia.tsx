"use client"

import Image from "next/image"
import { Media } from "@/types/pit"

interface TimelineMediaProps {
    media: Media[]
}

export default function TimelineMedia({ media }: TimelineMediaProps) {
    if (!media?.length) return null

    return (
        <div className="space-y-4 mt-4">
            {media.map((item) => (
                <div key={item._id.toString()} className="rounded-lg overflow-hidden">
                    {item.type === "image" ? (
                        <div className="aspect-video relative">
                            <Image
                                src={item.url}
                                alt={item.caption || ""}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <iframe
                            src={item.url}
                            title={item.caption || "YouTube video"}
                            className="w-full aspect-video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                    {item.caption && <p className="mt-2 text-sm text-gray-500">{item.caption}</p>}
                </div>
            ))}
        </div>
    )
}