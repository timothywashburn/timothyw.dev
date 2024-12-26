import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import { env } from '@/env'

const execAsync = promisify(exec)

export interface BackupMetadata {
    name: string
    createdAt: Date
    size: number
}

export class BackupService {
    private backupDir: string

    constructor() {
        this.backupDir = path.join(process.cwd(), 'backups')
    }

    private async ensureBackupDir() {
        await fs.mkdir(this.backupDir, { recursive: true })
    }

    async createBackup(name: string): Promise<BackupMetadata> {
        await this.ensureBackupDir()
        const filename = `${name}.gz`
        const filepath = path.join(this.backupDir, filename)

        const command = `mongodump --uri="${env.MONGODB_URI}" --archive="${filepath}" --gzip`

        try {
            await execAsync(command)
            const stats = await fs.stat(filepath)

            return {
                name,
                createdAt: new Date(),
                size: stats.size
            }
        } catch (error) {
            console.error('failed to create backup:', error)
            throw new Error('Failed to create backup')
        }
    }

    async restoreBackup(name: string): Promise<void> {
        const filepath = path.join(this.backupDir, `${name}.gz`)
        const command = `mongorestore --uri="${env.MONGODB_URI}" --archive="${filepath}" --gzip --drop`

        try {
            await execAsync(command)
        } catch (error) {
            console.error('failed to restore backup:', error)
            throw new Error('Failed to restore backup')
        }
    }

    async listBackups(): Promise<BackupMetadata[]> {
        await this.ensureBackupDir()

        const files = await fs.readdir(this.backupDir)
        const backups: BackupMetadata[] = []

        for (const file of files) {
            if (file.endsWith('.gz')) {
                const filepath = path.join(this.backupDir, file)
                const stats = await fs.stat(filepath)

                backups.push({
                    name: file.replace('.gz', ''),
                    createdAt: stats.birthtime,
                    size: stats.size
                })
            }
        }

        return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    async deleteBackup(name: string): Promise<void> {
        const filepath = path.join(this.backupDir, `${name}.gz`)
        await fs.unlink(filepath)
    }

    async renameBackup(oldName: string, newName: string): Promise<void> {
        const oldPath = path.join(this.backupDir, `${oldName}.gz`)
        const newPath = path.join(this.backupDir, `${newName}.gz`)
        await fs.rename(oldPath, newPath)
    }
}

export const backupService = new BackupService()