"use client";

import { ReactNode, FormEvent } from "react";
import BaseModal from "./BaseModal";
import { motion } from "framer-motion";

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: FormEvent) => void;
    title: string;
    children: ReactNode;
    description?: string;
    icon?: React.ElementType;
    submitText?: string;
    isValid?: boolean;
}

export default function FormModal({
    isOpen,
    onClose,
    onSubmit,
    title,
    children,
    description,
    icon: Icon,
    submitText = 'Save Changes',
    isValid = true
}: FormModalProps) {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={title} description={description} icon={Icon}>
            <form onSubmit={onSubmit}>
                {children}

                <div className="mt-6 border-t border-gray-100 pt-6 flex justify-end space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        onClick={onClose}
                        type="button"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={!isValid}
                        className={`px-4 py-2 text-white rounded-lg transition-colors ${
                            isValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'
                        }`}
                    >
                        {submitText}
                    </motion.button>
                </div>
            </form>
        </BaseModal>
    );
}