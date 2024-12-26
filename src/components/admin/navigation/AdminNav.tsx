"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"
import {
    LayoutDashboard,
    Database,
    Clock,
    LogOut,
    ChevronDown
} from "lucide-react"
import { useState } from "react"

const navigationItems = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard
    },
    {
        name: "Pit Timeline",
        href: "/admin/pit",
        icon: Clock
    },
    {
        name: "Backups",
        href: "/admin/backups",
        icon: Database
    }
]

export default function AdminNav() {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Desktop Navigation */}
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-gray-900">
                                Admin Panel
                            </span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navigationItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`inline-flex items-center px-1 pt-1 text-sm font-medium 
                                        ${isActive
                                            ? 'border-b-2 border-blue-500 text-gray-900'
                                            : 'text-gray-500 hover:border-b-2 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        <item.icon className="w-4 h-4 mr-2" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* User Menu */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <button
                            onClick={() => signOut()}
                            className="p-2 text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700"
                        >
                            <ChevronDown
                                className={`w-5 h-5 transition-transform duration-200 
                                ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <motion.div
                initial={false}
                animate={{
                    height: isMobileMenuOpen ? 'auto' : 0,
                    opacity: isMobileMenuOpen ? 1 : 0
                }}
                className="sm:hidden overflow-hidden"
            >
                <div className="pt-2 pb-3 space-y-1">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block pl-3 pr-4 py-2 text-base font-medium 
                                ${isActive
                                    ? 'border-l-4 border-blue-500 text-blue-700 bg-blue-50'
                                    : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center">
                                    <item.icon className="w-4 h-4 mr-2" />
                                    {item.name}
                                </div>
                            </Link>
                        )
                    })}
                    <button
                        onClick={() => signOut()}
                        className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50"
                    >
                        <div className="flex items-center">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </div>
                    </button>
                </div>
            </motion.div>
        </nav>
    )
}