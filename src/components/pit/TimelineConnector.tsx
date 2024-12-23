"use client"

interface TimelineConnectorProps {
    side: "left" | "right"
}

export default function TimelineConnector({ side }: TimelineConnectorProps) {
    const isLeft = side === "left"

    return (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            {/* Left line segment */}
            <div
                className={`w-6 h-0.5 bg-blue-500 ${!isLeft && 'opacity-0'}`}
            />

            {/* Center dot with spacing */}
            <div className="mx-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
            </div>

            {/* Right line segment */}
            <div
                className={`w-6 h-0.5 bg-blue-500 ${isLeft && 'opacity-0'}`}
            />
        </div>
    )
}