import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { getTimelineCollection } from "@/lib/db/mongodb"
import { TimelineEntry } from "@/types/pit"

export async function GET(req: Request) {
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

    const collection = await getTimelineCollection()
    const entries = await collection
        .find(query)
        .sort({ date: -1 })
        .toArray()

    return NextResponse.json(entries)
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const entry: Omit<TimelineEntry, "_id" | "createdAt" | "updatedAt"> = await req.json()
    const collection = await getTimelineCollection()

    const result = await collection.insertOne({
        ...entry,
        createdAt: new Date(),
        updatedAt: new Date()
    })

    return NextResponse.json({ _id: result.insertedId })
}

export async function PUT(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const entry: TimelineEntry = await req.json()
    const collection = await getTimelineCollection()

    await collection.updateOne(
        { _id: entry._id },
        {
            $set: {
                ...entry,
                updatedAt: new Date()
            }
        }
    )

    return new NextResponse(null, { status: 200 })
}

export async function DELETE(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { _id } = await req.json()
    const collection = await getTimelineCollection()

    await collection.deleteOne({ _id })

    return new NextResponse(null, { status: 200 })
}