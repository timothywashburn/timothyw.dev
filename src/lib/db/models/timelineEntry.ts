import mongoose from 'mongoose'
import { Media } from '@/types/pit'

const timelineEntrySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    media: [{
        type: {
            type: String,
            enum: ['image', 'youtube'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        thumbnail: String,
        caption: String,
        timelineEntryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TimelineEntry'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

timelineEntrySchema.index({ title: 'text', description: 'text', tags: 'text' })

export const TimelineEntryModel = mongoose.models.TimelineEntry ||
    mongoose.model('TimelineEntry', timelineEntrySchema, 'timeline_entries')