import { Plus } from "lucide-react"

interface BackupsHeaderProps {
    onCreateClick: () => void
}

export default function BackupsHeader({ onCreateClick }: BackupsHeaderProps) {
    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Database Backups
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage MongoDB backups
                        </p>
                    </div>
                    <button
                        onClick={onCreateClick}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Backup
                    </button>
                </div>
            </div>
        </header>
    )
}