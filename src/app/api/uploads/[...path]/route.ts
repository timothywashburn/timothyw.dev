import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

export async function GET(
    request: Request,
    { params }: { params: { path: string[] } }
) {
    const pathSegments = await Promise.resolve(params.path)
    const filepath = path.join(process.cwd(), "storage", "uploads", ...pathSegments)

    try {
        const file = await readFile(filepath)

        if (pathSegments.includes('..')) {
            return new NextResponse('Invalid path', { status: 400 })
        }

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