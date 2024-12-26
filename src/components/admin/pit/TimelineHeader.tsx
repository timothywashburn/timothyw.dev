import { Plus } from "lucide-react"

interface TimelineHeaderProps {
    onAddEntry: () => void
}

export default function TimelineHeader({ onAddEntry }: TimelineHeaderProps) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Pit Timeline Manager
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage and edit timeline entries
                        </p>
                    </div>
                    <button
                        onClick={onAddEntry}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700
                                 text-white font-medium rounded-lg transition-colors gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Entry
                    </button>
                </div>
            </div>
        </div>
    )
}