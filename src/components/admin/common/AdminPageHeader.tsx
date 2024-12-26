import { ReactNode } from "react"

interface AdminPageHeaderProps {
    title: string
    description?: string
    action?: ReactNode
}

export default function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
    return (
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-24 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-1 text-sm text-gray-500">
                                {description}
                            </p>
                        )}
                    </div>
                    {action && (
                        <div>
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}