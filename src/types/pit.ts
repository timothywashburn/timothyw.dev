import { ObjectId } from "mongodb"

export interface TimelineEntry {
    _id: string | ObjectId
    date: Date
    title: string
    description: string
    media: Media[]
    tags?: string[]
    createdAt: Date
    updatedAt: Date
}

export interface Media {
    _id: string | ObjectId
    type: "image" | "youtube"
    url: string
    thumbnail?: string
    caption?: string
    timelineEntryId: string
    createdAt: Date
}

export interface TimelineFilter {
    startDate?: Date
    endDate?: Date
    tags?: string[]
    search?: string
}