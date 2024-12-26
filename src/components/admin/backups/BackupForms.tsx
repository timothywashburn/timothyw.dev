import { ChangeEvent } from 'react';

const BACKUP_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;
const MAX_LENGTH = 100;

interface BackupNameInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onValidityChange: (isValid: boolean) => void;
}

function BackupNameInput({ value, onChange, onValidityChange }: BackupNameInputProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        const isValid = e.target.value.length > 0 &&
            e.target.value.length <= MAX_LENGTH &&
            BACKUP_NAME_REGEX.test(e.target.value);
        onValidityChange(isValid);
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-2">
                Backup Name
            </label>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
                pattern="[a-zA-Z0-9_-]+"
                maxLength={MAX_LENGTH}
                title="Name can only contain letters, numbers, underscores, and hyphens"
            />
        </div>
    );
}

export function CreateBackupForm({ value, onChange, onValidityChange }: BackupNameInputProps) {
    return <BackupNameInput value={value} onChange={onChange} onValidityChange={onValidityChange} />;
}

export function RenameBackupForm({ value, onChange, onValidityChange }: BackupNameInputProps) {
    return <BackupNameInput value={value} onChange={onChange} onValidityChange={onValidityChange} />;
}