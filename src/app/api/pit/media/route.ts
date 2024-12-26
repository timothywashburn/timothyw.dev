import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { auth } from "@/lib/auth/config"
import dbConnect from "@/lib/db/mongoose"
import { TimelineEntryModel } from "@/lib/db/models/timelineEntry"
import { Media } from "@/types/pit"
import { Types } from "mongoose"

const UPLOADS_DIR = path.join(process.cwd(), "storage", "uploads", "pit")

export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    await dbConnect()

    const formData = await req.formData()
    const file = formData.get("file") as File
    const timelineEntryId = formData.get("timelineEntryId") as string
    const caption = formData.get("caption") as string

    if (!file) {
        return new NextResponse("No file uploaded", { status: 400 })
    }

    // Ensure uploads directory exists
    await mkdir(UPLOADS_DIR, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sanitize filename and add timestamp
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${Date.now()}-${sanitizedFilename}`
    const filepath = path.join(UPLOADS_DIR, filename)

    try {
        await writeFile(filepath, buffer)
    } catch (error) {
        console.error('Error writing file:', error)
        return new NextResponse("Failed to save file", { status: 500 })
    }

    const entry = await TimelineEntryModel.findById(timelineEntryId)
    if (!entry) {
        return new NextResponse("Timeline entry not found", { status: 404 })
    }

    const mediaId = new Types.ObjectId()
    const media: Media = {
        _id: mediaId,
        type: "image",
        url: UPLOADS_DIR + `/${filename}`,
        caption,
        timelineEntryId: new Types.ObjectId(timelineEntryId),
        createdAt: new Date()
    }

    entry.media.push(media)
    await entry.save()

    return NextResponse.json({
        ...media,
        _id: mediaId.toString(),
        timelineEntryId: timelineEntryId.toString()
    })
}

export async function DELETE(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    await dbConnect()

    const { _id, timelineEntryId } = await req.json()

    try {
        const entry = await TimelineEntryModel.findById(timelineEntryId)
        if (!entry) {
            return new NextResponse("Timeline entry not found", { status: 404 })
        }

        // Find the media item to get its URL
        const mediaItem = entry.media.find((m: Media) => m._id.toString() === _id)
        if (!mediaItem) {
            return new NextResponse("Media not found", { status: 404 })
        }

        // Remove the media from the database
        entry.media = entry.media.filter((m: Media) => m._id.toString() !== _id)
        await entry.save()

        // Return success
        return new NextResponse(null, { status: 200 })
    } catch (error) {
        console.error('Error deleting media:', error)
        return new NextResponse("Failed to delete media", { status: 500 })
    }
}