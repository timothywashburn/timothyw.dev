import mongoose, { Schema } from 'mongoose'
import type { Media } from '@/types/pit'

const mediaSchema = new Schema<Media>({
    type: { type: String, enum: ['image', 'youtube'], required: true },
    url: { type: String, required: true },
    thumbnail: String,
    caption: String,
    timelineEntryId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

export const MediaModel = mongoose.models.Media || mongoose.model<Media>('Media', mediaSchema)