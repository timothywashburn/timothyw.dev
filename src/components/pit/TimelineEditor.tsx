"use client";

import { useState } from "react";
import { TimelineEntry, Media } from "@/types/pit";
import { timelineService } from "@/lib/services/timelineService";
import MediaManager from "./TimelineMediaManager";
import { useToast } from "@/components/ui/Toast";
import BaseModal from "@/components/ui/modal/BaseModal";
import { motion } from "framer-motion";

interface TimelineEditorProps {
    isOpen: boolean;
    entry?: TimelineEntry;
    onClose: () => void;
    onSaveComplete: () => void;
}

export default function TimelineEditor({
    isOpen,
    entry,
    onClose,
    onSaveComplete
}: TimelineEditorProps) {
    const { showToast } = useToast();
    const [title, setTitle] = useState(entry?.title || "");
    const [date, setDate] = useState(entry?.date ? new Date(entry.date).toISOString().split("T")[0] : "");
    const [description, setDescription] = useState(entry?.description || "");
    const [tags, setTags] = useState(entry?.tags?.join(", ") || "");
    const [media, setMedia] = useState<Media[]>(entry?.media || []);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const processedMedia = await Promise.all(
                media.map(async (item) => {
                    if (item._id.toString().startsWith('temp-') && item.file) {
                        const formData = new FormData();
                        formData.append("file", item.file);
                        formData.append("timelineEntryId", entry?._id?.toString() || "");
                        formData.append("caption", item.caption || "");

                        const response = await fetch("/api/pit/media", {
                            method: "POST",
                            body: formData,
                        });

                        if (!response.ok) {
                            throw new Error("Failed to upload media");
                        }

                        return await response.json();
                    }
                    return item;
                })
            );

            const validMedia = processedMedia.filter(Boolean);
            const entryData: Partial<TimelineEntry> = {
                title,
                date: new Date(date),
                description: description || undefined,
                tags: tags.split(",").map(t => t.trim()).filter(Boolean),
                media: validMedia,
            };

            if (entry?._id) {
                await timelineService.updateEntry({ ...entryData, _id: entry._id } as TimelineEntry);
                showToast('Entry updated successfully', 'success');
            } else {
                const id = await timelineService.createEntry(entryData);
                showToast('Entry created successfully', 'success');
            }

            onSaveComplete();
        } catch (error) {
            console.error("error saving entry:", error);
            showToast('Failed to save entry', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={entry ? "Edit Entry" : "Add New Entry"}
            description={entry ? "Make changes to your timeline entry" : "Create a new timeline entry"}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description (optional)</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md h-32"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                    <input
                        type="text"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="tag1, tag2, tag3"
                    />
                </div>

                {entry?._id && (
                    <MediaManager
                        media={media}
                        onMediaChange={setMedia}
                    />
                )}

                <div className="mt-6 border-t border-gray-100 pt-6 flex justify-end space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="px-4 py-2 text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: saving ? 1 : 1.02 }}
                        whileTap={{ scale: saving ? 1 : 0.98 }}
                        type="submit"
                        disabled={saving}
                        className={`px-4 py-2 text-white rounded-lg transition-colors ${
                            saving ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                </div>
            </form>
        </BaseModal>
    );
}