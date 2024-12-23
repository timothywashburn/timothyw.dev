import Timeline from "@/components/pit/Timeline"

export default function PitPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-center">Pit Journey Timeline</h1>
                    <p className="text-center text-gray-600 mt-2">
                        A chronicle of my adventures and achievements in Hypixel's Pit
                    </p>
                </div>
                <Timeline />
            </div>
        </div>
    )
}