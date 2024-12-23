"use client"

import { ReactNode } from "react"
import BaseModal from "./BaseModal"
import { motion } from "framer-motion"

interface FormModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    description?: string
    icon?: React.ElementType
}

export default function FormModal(props: FormModalProps) {
    return (
        <BaseModal {...props}>
            <div>
                {props.children}

                <div className="mt-6 border-t border-gray-100 pt-6 flex justify-end space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-700 bg-gray-100
                                 hover:bg-gray-200 rounded-lg transition-colors"
                        onClick={props.onClose}
                        type="button"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        form="modal-form"
                        className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600
                                 rounded-lg transition-colors"
                    >
                        Save Changes
                    </motion.button>
                </div>
            </div>
        </BaseModal>
    )
}