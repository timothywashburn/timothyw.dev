"use client"

import BaseModal from "./BaseModal"
import { AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface DeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
}

export default function DeleteModal({
                                        isOpen,
                                        onClose,
                                        onConfirm,
                                        title,
                                        description
                                    }: DeleteModalProps) {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description}
            icon={AlertCircle}
        >
            <div className="mt-4 flex justify-end gap-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                    Cancel
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
                >
                    Delete
                </motion.button>
            </div>
        </BaseModal>
    )
}