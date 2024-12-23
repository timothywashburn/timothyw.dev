import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import dbConnect from "@/lib/db/mongoose"
import { TimelineEntryModel } from "@/lib/db/models/timelineEntry"

export async function GET(req: Request) {
    await dbConnect()

    const searchParams = new URL(req.url).searchParams
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const tags = searchParams.get("tags")?.split(",")
    const search = searchParams.get("search")

    const query: any = {}
    if (startDate) query.date = { $gte: new Date(startDate) }
    if (endDate) query.date = { ...query.date, $lte: new Date(endDate) }
    if (tags?.length) query.tags = { $in: tags }
    if (search) query.$text = { $search: search }

    const entries = await TimelineEntryModel.find(query).sort({ date: -1 })
    return NextResponse.json(entries)
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    await dbConnect()
    const data = await req.json()
    console.log('Received data:', data)

    try {
        const entry = await TimelineEntryModel.create(data)
        console.log('Created entry:', entry)
        return NextResponse.json({ _id: entry._id.toString() })
    } catch (error) {
        console.error('Error creating entry:', error)
        return new NextResponse("Error creating entry", { status: 500 })
    }
}

export async function PUT(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    await dbConnect()
    const { _id, ...updateData } = await req.json()
    await TimelineEntryModel.findByIdAndUpdate(_id, updateData)
    return new NextResponse(null, { status: 200 })
}

export async function DELETE(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    await dbConnect()
    const { _id } = await req.json()
    await TimelineEntryModel.findByIdAndDelete(_id)
    return new NextResponse(null, { status: 200 })
}