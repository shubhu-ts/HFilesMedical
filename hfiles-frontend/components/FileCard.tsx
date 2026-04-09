"use client";

import { useState } from "react";
import { deleteFile, MedicalFile } from "@/lib/api";

interface FileCardProps {
  file: MedicalFile;
  onDeleted: (id: number) => void;
}

const TYPE_COLORS: Record<string, string> = {
  "Lab Report": "bg-blue-100 text-blue-700",
  "Prescription": "bg-purple-100 text-purple-700",
  "X-Ray": "bg-gray-100 text-gray-700",
  "Blood Report": "bg-red-100 text-red-700",
  "MRI Scan": "bg-teal-100 text-teal-700",
  "CT Scan": "bg-orange-100 text-orange-700",
};

const TYPE_ICONS: Record<string, string> = {
  "Lab Report": "🧪",
  "Prescription": "💊",
  "X-Ray": "🩻",
  "Blood Report": "🩸",
  "MRI Scan": "🧲",
  "CT Scan": "🔬",
};

function FilePreviewThumb({ file }: { file: MedicalFile }) {
  const isImage = file.mimeType?.startsWith("image/");
  const isPdf = file.mimeType === "application/pdf";

  if (isImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={file.fileUrl}
        alt={file.fileName}
        className="w-full h-full object-cover"
      />
    );
  }
  if (isPdf) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-red-50">
        <span className="text-3xl">📄</span>
        <span className="text-xs text-red-400 mt-1 font-semibold">PDF</span>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#f0f4ff]">
      <span className="text-3xl">{TYPE_ICONS[file.fileType] || "📁"}</span>
    </div>
  );
}

export default function FileCard({ file, onDeleted }: FileCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${file.fileName}"?`)) return;
    setDeleting(true);
    try {
      await deleteFile(file.id);
      onDeleted(file.id);
    } catch {
      alert("Failed to delete file.");
      setDeleting(false);
    }
  };

  const handleView = () => {
    const isImage = file.mimeType?.startsWith("image/");
    if (isImage) {
      setShowModal(true);
    } else {
      window.open(file.fileUrl, "_blank");
    }
  };

  const colorClass = TYPE_COLORS[file.fileType] || "bg-gray-100 text-gray-700";
  const icon = TYPE_ICONS[file.fileType] || "📁";

  const uploadDate = new Date(file.uploadedAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <>
      <div className="card overflow-hidden flex flex-col animate-fade-up group hover:shadow-md transition-shadow">
        {/* Thumbnail */}
        <div className="w-full h-36 bg-[#f0f4ff] overflow-hidden relative">
          <FilePreviewThumb file={file} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${colorClass}`}>
              {icon} {file.fileType}
            </span>
          </div>
          <p className="font-semibold text-sm text-[#1a2340] line-clamp-2 leading-snug">
            {file.fileName}
          </p>
          <p className="text-xs text-[#9aa5c4]">{uploadDate}</p>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleView}
              className="btn-outline flex-1 text-xs py-2"
            >
              View
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-danger flex-1 text-xs py-2"
            >
              {deleting ? "…" : "Delete"}
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8eeff]">
              <div>
                <p className="font-semibold text-sm text-[#1a2340]">{file.fileName}</p>
                <span className={`text-xs font-bold ${colorClass} px-1.5 py-0.5 rounded-full`}>
                  {file.fileType}
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6b7a9e] hover:text-[#1a2340] text-xl leading-none"
              >
                ✕
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={file.fileUrl}
              alt={file.fileName}
              className="max-h-[75vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
