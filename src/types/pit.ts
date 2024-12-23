import { Types } from 'mongoose'

export interface Media {
    _id: Types.ObjectId | string
    type: 'image' | 'youtube'
    url: string
    thumbnail?: string
    caption?: string
    timelineEntryId: Types.ObjectId | string
    createdAt: Date
}

export interface TimelineEntry {
    _id: Types.ObjectId | string
    date: Date
    title: string
    description?: string
    media: Media[]
    tags?: string[]
    createdAt: Date
    updatedAt: Date
}