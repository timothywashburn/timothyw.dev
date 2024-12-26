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
        const newValue = e.target.value;
        onChange(e);

        const isValid = newValue.length > 0 &&
            newValue.length <= MAX_LENGTH &&
            BACKUP_NAME_REGEX.test(newValue);
        onValidityChange(isValid);
    };

    return (
        <div>
            <label htmlFor="backupName" className="block text-sm font-medium mb-2">
                Backup Name
            </label>
            <input
                id="backupName"
                type="text"
                value={value}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
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
