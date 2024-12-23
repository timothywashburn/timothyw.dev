import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { auth } from "@/lib/auth/config"
import { getMediaCollection } from "@/lib/db/mongodb"

const STORAGE_PATH = path.join(process.cwd(), "storage", "pit")

export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const timelineEntryId = formData.get("timelineEntryId") as string
    const caption = formData.get("caption") as string

    if (!file) {
        return new NextResponse("No file uploaded", { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")

    const dir = path.join(STORAGE_PATH, String(year), month)
    await mkdir(dir, { recursive: true })

    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(dir, filename)
    await writeFile(filepath, buffer)

    const collection = await getMediaCollection()
    const media = {
        type: "image",
        url: `/storage/pit/${year}/${month}/${filename}`,
        caption,
        timelineEntryId,
        createdAt: date
    }

    const result = await collection.insertOne(media)

    return NextResponse.json({ _id: result.insertedId })
}

export async function DELETE(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { _id } = await req.json()
    const collection = await getMediaCollection()

    await collection.deleteOne({ _id })

    return new NextResponse(null, { status: 200 })
}