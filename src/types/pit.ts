export interface Media {
    _id: string
    type: 'image' | 'youtube'
    url: string
    thumbnail?: string
    caption?: string
    timelineEntryId: string
    createdAt: Date
}

export interface TimelineEntry {
    _id: string
    date: Date
    title: string
    description: string
    media: Media[]
    tags?: string[]
    createdAt: Date
    updatedAt: Date
}