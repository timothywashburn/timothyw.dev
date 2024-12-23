"use client"

import { motion } from "framer-motion"
import { TimelineEntry } from "@/types/pit"
import React from "react";

interface TimelineCardProps {
    children: React.ReactNode
    side: "left" | "right"
    onClick: (e: React.MouseEvent) => void
}

export default function TimelineCard({ children, side, onClick }: TimelineCardProps) {
    const isLeft = side === "left"

    return (
        <div
            className={`bg-white rounded-lg shadow p-6 transition-transform duration-200 hover:-translate-y-1 cursor-pointer
                ${isLeft ? 'ml-auto mr-0' : 'ml-0 mr-auto'} max-w-lg`}
    onClick={onClick}
    >
    <motion.div
        initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
>
    {children}
    </motion.div>
    </div>
)
}