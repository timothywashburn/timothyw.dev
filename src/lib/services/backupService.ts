import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { env } from '@/env';
import mongoose from 'mongoose';
import dbConnect from "@/lib/db/mongoose";

const execAsync = promisify(exec);

export interface BackupMetadata {
    name: string;
    createdAt: Date;
    size: number;
    documentCount: number;
}

export class BackupService {
    private backupDir: string;

    constructor() {
        this.backupDir = path.join(process.cwd(), 'storage', 'backups');
    }

    private async ensureBackupDir() {
        await fs.mkdir(this.backupDir, { recursive: true });
    }

    private async getTotalDocumentCount(): Promise<number> {
        await dbConnect();
        const collections = await mongoose.connection.db.collections();
        let totalCount = 0;

        for (const collection of collections) {
            totalCount += await collection.countDocuments();
        }

        return totalCount;
    }

    async createBackup(name: string): Promise<BackupMetadata> {
        await dbConnect();
        await this.ensureBackupDir();
        const filename = `${name}.gz`;
        const filepath = path.join(this.backupDir, filename);

        const documentCount = await this.getTotalDocumentCount();
        const command = `mongodump --uri="${env.MONGODB_URI}" --archive="${filepath}" --gzip`;

        try {
            await execAsync(command);
            const stats = await fs.stat(filepath);

            const metadata: BackupMetadata = {
                name,
                createdAt: new Date(),
                size: stats.size,
                documentCount
            };

            await this.saveMetadata(name, metadata);
            return metadata;
        } catch (error) {
            console.error('failed to create backup:', error);
            throw new Error('Failed to create backup');
        }
    }

    private async saveMetadata(name: string, metadata: BackupMetadata) {
        const metadataPath = path.join(this.backupDir, `${name}.meta.json`);
        await fs.writeFile(metadataPath, JSON.stringify(metadata));
    }

    private async loadMetadata(name: string): Promise<BackupMetadata | null> {
        try {
            const metadataPath = path.join(this.backupDir, `${name}.meta.json`);
            const content = await fs.readFile(metadataPath, 'utf-8');
            return JSON.parse(content);
        } catch {
            return null;
        }
    }

    async restoreBackup(name: string): Promise<void> {
        await dbConnect();
        const filepath = path.join(this.backupDir, `${name}.gz`);
        const command = `mongorestore --uri="${env.MONGODB_URI}" --archive="${filepath}" --gzip --drop`;

        try {
            await execAsync(command);
        } catch (error) {
            console.error('failed to restore backup:', error);
            throw new Error('Failed to restore backup');
        }
    }

    async listBackups(): Promise<BackupMetadata[]> {
        await this.ensureBackupDir();
        const files = await fs.readdir(this.backupDir);
        const backups: BackupMetadata[] = [];

        for (const file of files) {
            if (!file.endsWith('.meta.json')) continue;

            try {
                const metaContent = await fs.readFile(path.join(this.backupDir, file), 'utf-8');
                const backup = JSON.parse(metaContent) as BackupMetadata;
                backups.push(backup);
            } catch (error) {
                console.error('failed to read backup metadata:', error);
                continue;
            }
        }

        return backups.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    async deleteBackup(name: string): Promise<void> {
        const filepath = path.join(this.backupDir, `${name}.gz`);
        const metadataPath = path.join(this.backupDir, `${name}.meta.json`);

        await Promise.all([
            fs.unlink(filepath).catch(() => {}),
            fs.unlink(metadataPath).catch(() => {})
        ]);
    }

    async renameBackup(oldName: string, newName: string): Promise<void> {
        const oldPath = path.join(this.backupDir, `${oldName}.gz`);
        const newPath = path.join(this.backupDir, `${newName}.gz`);
        const oldMetaPath = path.join(this.backupDir, `${oldName}.meta.json`);
        const newMetaPath = path.join(this.backupDir, `${newName}.meta.json`);

        await Promise.all([
            fs.rename(oldPath, newPath),
            fs.rename(oldMetaPath, newMetaPath).catch(() => {})
        ]);
    }
}

export const backupService = new BackupService();