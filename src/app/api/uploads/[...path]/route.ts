import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

export async function GET(
    request: Request,
    { params }: { params: { path: string[] } }
) {
    const pathSegments = params.path
    const filepath = path.join(process.cwd(), "uploads", ...pathSegments)

    try {
        const file = await readFile(filepath)

        const ext = path.extname(filepath).toLowerCase()
        const contentType = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }[ext] || 'application/octet-stream'

        return new NextResponse(file, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000',
            },
        })
    } catch (error) {
        console.error('Error serving file:', error)
        return new NextResponse('File not found', { status: 404 })
    }
}