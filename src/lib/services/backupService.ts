import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { env } from '@/env';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';

const execAsync = promisify(exec);

export interface BackupMetadata {
    name: string;
    createdAt: Date;
    size: number;
    documentCount: number;
}

export class BackupError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'BackupError';
    }
}

export class BackupService {
    private backupDir: string;
    private readonly validNameRegex = /^[a-zA-Z0-9_-]+$/;
    private readonly maxNameLength = 100;

    constructor() {
        this.backupDir = path.join(process.cwd(), 'storage', 'backups');
    }

    private async ensureBackupDir() {
        await fs.mkdir(this.backupDir, { recursive: true });
    }

    private validateBackupName(name: string) {
        if (!name || name.trim().length === 0) {
            throw new BackupError('Backup name cannot be empty', 'EMPTY_NAME');
        }

        if (name.length > this.maxNameLength) {
            throw new BackupError(`Backup name cannot exceed ${this.maxNameLength} characters`, 'NAME_TOO_LONG');
        }

        if (!this.validNameRegex.test(name)) {
            throw new BackupError('Backup name can only contain letters, numbers, underscores, and hyphens', 'INVALID_CHARS');
        }

        const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4',
            'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4',
            'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];

        if (reservedNames.includes(name.toUpperCase())) {
            throw new BackupError('Backup name cannot use reserved system names', 'RESERVED_NAME');
        }
    }

    private async checkBackupExists(name: string): Promise<boolean> {
        try {
            await fs.access(path.join(this.backupDir, `${name}.gz`));
            return true;
        } catch {
            return false;
        }
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
        this.validateBackupName(name);

        const exists = await this.checkBackupExists(name);
        if (exists) {
            throw new BackupError('A backup with this name already exists', 'DUPLICATE_NAME');
        }

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
            throw new BackupError('Failed to create backup', 'CREATE_FAILED');
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
        const exists = await this.checkBackupExists(name);
        if (!exists) {
            throw new BackupError('Backup not found', 'NOT_FOUND');
        }

        await dbConnect();
        const filepath = path.join(this.backupDir, `${name}.gz`);
        const command = `mongorestore --uri="${env.MONGODB_URI}" --archive="${filepath}" --gzip --drop`;

        try {
            await execAsync(command);
        } catch (error) {
            console.error('failed to restore backup:', error);
            throw new BackupError('Failed to restore backup', 'RESTORE_FAILED');
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
        const exists = await this.checkBackupExists(name);
        if (!exists) {
            throw new BackupError('Backup not found', 'NOT_FOUND');
        }

        const filepath = path.join(this.backupDir, `${name}.gz`);
        const metadataPath = path.join(this.backupDir, `${name}.meta.json`);

        await Promise.all([
            fs.unlink(filepath).catch(() => {}),
            fs.unlink(metadataPath).catch(() => {})
        ]);
    }

    async renameBackup(oldName: string, newName: string): Promise<void> {
        this.validateBackupName(newName);

        const oldExists = await this.checkBackupExists(oldName);
        if (!oldExists) {
            throw new BackupError('Backup not found', 'NOT_FOUND');
        }

        const newExists = await this.checkBackupExists(newName);
        if (newExists) {
            throw new BackupError('A backup with the new name already exists', 'DUPLICATE_NAME');
        }

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