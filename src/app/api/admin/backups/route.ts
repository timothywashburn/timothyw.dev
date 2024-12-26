import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { backupService } from "@/lib/services/backupService"

export async function GET() {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const backups = await backupService.listBackups()
        return NextResponse.json(backups)
    } catch (error) {
        console.error('failed to list backups:', error)
        return new NextResponse("Failed to list backups", { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { name, action, newName } = await req.json()

        switch (action) {
            case 'create':
                const backup = await backupService.createBackup(name)
                return NextResponse.json(backup)

            case 'restore':
                await backupService.restoreBackup(name)
                return new NextResponse(null, { status: 200 })

            case 'delete':
                await backupService.deleteBackup(name)
                return new NextResponse(null, { status: 200 })

            case 'rename':
                await backupService.renameBackup(name, newName)
                return new NextResponse(null, { status: 200 })

            default:
                return new NextResponse("Invalid action", { status: 400 })
        }
    } catch (error) {
        console.error('backup operation failed:', error)
        return new NextResponse("Backup operation failed", { status: 500 })
    }
}