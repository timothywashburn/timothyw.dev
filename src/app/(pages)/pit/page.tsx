import Timeline from "@/components/pit/Timeline"

export default function PitPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Modern Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Pit Journey Timeline
                            </h1>
                            <p className="text-sm font-medium text-gray-500">
                                A chronicle of my adventures and achievements in Hypixel's Pit
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Timeline />
            </div>
        </div>
    )
}