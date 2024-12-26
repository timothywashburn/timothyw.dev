"use client";

import { useState, useEffect } from "react";
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
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [media, setMedia] = useState<Media[]>([]);
    const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTitle(entry?.title || "");
            setDate(entry?.date ? new Date(entry.date).toISOString().split("T")[0] : "");
            setDescription(entry?.description || "");
            setTags(entry?.tags?.join(", ") || "");
            setMedia(entry?.media || []);
            setDeletedMediaIds([]); // Reset deleted media tracking when modal opens
        } else {
            setTitle("");
            setDate("");
            setDescription("");
            setTags("");
            setMedia([]);
            setDeletedMediaIds([]);
        }
    }, [isOpen, entry]);

    const handleMediaChange = (newMedia: Media[]) => {
        // Track deleted media IDs that aren't temporary (don't start with 'temp-')
        const deletedMedia = media.filter(m =>
            !newMedia.some(nm => nm._id === m._id) &&
            !m._id.toString().startsWith('temp-')
        );

        const newDeletedIds = deletedMedia.map(m => m._id.toString());
        setDeletedMediaIds(prev => [...prev, ...newDeletedIds]);
        setMedia(newMedia);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Handle media deletions
            for (const mediaId of deletedMediaIds) {
                const response = await fetch("/api/pit/media", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        _id: mediaId,
                        timelineEntryId: entry?._id,
                    }),
                });

                if (!response.ok) {
                    console.error("failed to delete media:", mediaId);
                }
            }

            // Handle media uploads
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

                        const uploadedMedia = await response.json();
                        return uploadedMedia;
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
                await timelineService.createEntry(entryData);
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

    const handleClose = () => {
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
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

                <MediaManager
                    media={media}
                    onMediaChange={handleMediaChange}
                />

                <div className="mt-6 border-t border-gray-100 pt-6 flex justify-end space-x-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleClose}
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