"use client"

import { ReactNode, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface BaseModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    description?: string
    icon?: React.ElementType
    showClose?: boolean
}

export default function BaseModal({
                                      isOpen,
                                      onClose,
                                      title,
                                      description,
                                      children,
                                      icon: Icon,
                                      showClose = true
                                  }: BaseModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [onClose])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        {Icon && (
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                            {description && (
                                <p className="mt-1 text-sm text-gray-500">{description}</p>
                            )}
                        </div>
                    </div>
                    {showClose && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="p-6 max-h-[calc(90vh-12rem)] overflow-y-auto">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    )
}