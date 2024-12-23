import { TimelineEntry } from "@/types/pit"

export class TimelineService {
    async fetchEntries(): Promise<TimelineEntry[]> {
        const res = await fetch("/api/pit/timeline")
        if (!res.ok) throw new Error("Failed to fetch timeline")
        return res.json()
    }

    async createEntry(entryData: Partial<TimelineEntry>): Promise<string> {
        const res = await fetch("/api/pit/timeline", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entryData)
        })
        if (!res.ok) throw new Error("Failed to create entry")
        const data = await res.json()
        return data._id
    }

    async updateEntry(entryData: TimelineEntry): Promise<void> {
        const res = await fetch("/api/pit/timeline", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entryData)
        })
        if (!res.ok) throw new Error("Failed to update entry")
    }

    async deleteEntry(id: string): Promise<void> {
        const res = await fetch("/api/pit/timeline", {
            method: "DELETE",
            body: JSON.stringify({ _id: id })
        })
        if (!res.ok) throw new Error("Failed to delete entry")
    }
}

export const timelineService = new TimelineService()