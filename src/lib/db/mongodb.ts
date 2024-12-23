import { MongoClient, Db } from "mongodb"
import type { TimelineEntry, Media } from "@/types/pit"

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>
let db: Db

if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export async function getDb() {
    if (!db) {
        const client = await clientPromise
        db = client.db("timothyw_dev")
    }
    return db
}

export async function getTimelineCollection() {
    const db = await getDb()
    return db.collection<TimelineEntry>("timeline_entries")
}

export async function getMediaCollection() {
    const db = await getDb()
    return db.collection<Media>("media_files")
}