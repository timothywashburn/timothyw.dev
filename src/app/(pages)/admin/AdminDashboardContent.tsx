"use client"

import Link from "next/link"
import {
    Clock,
    Database,
    ArrowRight
} from "lucide-react"
import { motion } from "framer-motion"

const adminModules = [
    {
        title: "Pit Timeline Manager",
        description: "Manage Pit timeline entries",
        icon: Clock,
        href: "/admin/pit",
        color: "bg-blue-500"
    },
    {
        title: "Database Backups",
        description: "Create and manage database backups",
        icon: Database,
        href: "/admin/backups",
        color: "bg-purple-500"
    }
]

export default function AdminDashboardContent() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Admin Modules
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Select from below or use the navigation bar
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {adminModules.map((module, index) => (
                    <motion.div
                        key={module.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            href={module.href}
                            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-lg ${module.color}`}>
                                    <module.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {module.title}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {module.description}
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}