"use client"

interface TimelineConnectorProps {
    isFirst: boolean
    isLast: boolean
}

export default function TimelineConnector({ isFirst, isLast }: TimelineConnectorProps) {
    return (
        <div className="flex flex-col items-center w-4">
            <div className={`w-0.5 h-6 bg-blue-500 mb-2 shrink-0 ${isFirst ? 'opacity-0' : ''}`} />
            <div className="w-3 h-3 bg-blue-500 rounded-full shrink-0" />
            <div className={`w-0.5 bg-blue-500 flex-1 mt-2 ${isLast ? 'opacity-0' : ''}`} />
        </div>
    )
}