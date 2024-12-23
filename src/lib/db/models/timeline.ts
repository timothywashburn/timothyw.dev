import mongoose, { Schema } from 'mongoose'
import type { TimelineEntry } from '@/types/pit'

const timelineSchema = new Schema<TimelineEntry>({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    media: [{
        type: { type: String, enum: ['image', 'youtube'], required: true },
        url: { type: String, required: true },
        thumbnail: String,
        caption: String,
        timelineEntryId: String,
        createdAt: { type: Date, default: Date.now }
    }],
    tags: [String],
}, {
    timestamps: true
})

export const TimelineModel = mongoose.models.Timeline || mongoose.model<TimelineEntry>('Timeline', timelineSchema)