import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { auth } from "@/lib/auth/config"
import dbConnect from "@/lib/db/mongoose"
import { MediaModel } from "@/lib/db/models/media"

const STORAGE_PATH = path.join(process.cwd(), "storage", "pit")

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

    const media = await MediaModel.create({
        type: "image",
        url: `/storage/pit/${year}/${month}/${filename}`,
        caption,
        timelineEntryId
    })

    return NextResponse.json(media)
}

export async function DELETE(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    await dbConnect()
    const { _id } = await req.json()
    await MediaModel.findByIdAndDelete(_id)
    return new NextResponse(null, { status: 200 })
}