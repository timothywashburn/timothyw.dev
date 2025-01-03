"use client";

import { useState } from "react";
import { Media } from "@/types/pit";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";

interface MediaManagerProps {
    media: Media[];
    onMediaChange: (newMedia: Media[]) => void;
}

export default function MediaManager({ media, onMediaChange }: MediaManagerProps) {
    const [uploading, setUploading] = useState(false);
    const { showToast } = useToast();

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length) return;

        setUploading(true);
        const file = e.target.files[0];

        try {
            const previewUrl = URL.createObjectURL(file);
            const tempMedia: Media = {
                _id: `temp-${Date.now()}`,
                type: "image",
                url: previewUrl,
                caption: "",
                file: file,
                timelineEntryId: "",
                createdAt: new Date()
            };

            onMediaChange([...media, tempMedia]);
            showToast('Media added', 'success');
        } catch (error) {
            console.error("failed to handle file:", error);
            showToast('Failed to add media', 'error');
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    function handleDelete(mediaItem: Media, e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        onMediaChange(media.filter(m => m._id.toString() !== mediaItem._id.toString()));
        showToast('Media removed', 'info');
    }

    function handleCaptionChange(mediaItem: Media, newCaption: string) {
        onMediaChange(media.map(m =>
            m._id.toString() === mediaItem._id.toString()
                ? { ...m, caption: newCaption }
                : m
        ));
    }

    return (
        <div className="space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Media</h3>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Adding..." : "Add Media"}
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                </label>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {media.map((item) => (
                    <div key={item._id.toString()} className="relative bg-gray-50 p-4 rounded-lg">
                        <div className="aspect-video relative mb-2">
                            <Image
                                src={item.url}
                                alt={item.caption || "Media"}
                                fill
                                className="object-cover rounded-md"
                                unoptimized={item.url.startsWith('blob:')}
                            />
                            <button
                                onClick={(e) => handleDelete(item, e)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                type="button"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={item.caption || ""}
                            onChange={(e) => handleCaptionChange(item, e.target.value)}
                            placeholder="Add a caption..."
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}