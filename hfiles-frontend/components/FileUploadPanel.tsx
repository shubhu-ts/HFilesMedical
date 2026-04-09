"use client";

import { useState, useRef } from "react";
import { uploadFile, MedicalFile } from "@/lib/api";

const FILE_TYPES = [
  "Lab Report",
  "Prescription",
  "X-Ray",
  "Blood Report",
  "MRI Scan",
  "CT Scan",
];

interface FileUploadPanelProps {
  onUploaded: (file: MedicalFile) => void;
}

export default function FileUploadPanel({ onUploaded }: FileUploadPanelProps) {
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setSelectedFile(f);
    setError("");
    // Auto-fill name from filename if empty
    if (f && !fileName) {
      setFileName(f.name.replace(/\.[^.]+$/, ""));
    }
  };

  const handleSubmit = async () => {
    if (!fileType) { setError("Please select a file type."); return; }
    if (!fileName.trim()) { setError("Please enter a file name."); return; }
    if (!selectedFile) { setError("Please choose a file to upload."); return; }

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(selectedFile.type)) {
      setError("Only PDF and image files are allowed.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");
    try {
      const res = await uploadFile(fileType, fileName.trim(), selectedFile);
      onUploaded(res.data);
      setSuccess(`"${fileName}" uploaded successfully!`);
      setFileType("");
      setFileName("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Upload failed. Please try again.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-6 flex flex-col gap-5">
      <div>
        <h2 className="font-display font-bold text-[#1a2340] text-lg">
          Add Medical Record
        </h2>
        <p className="text-sm text-[#6b7a9e] mt-0.5">
          Upload PDFs or images (Lab Reports, X-Rays, etc.)
        </p>
      </div>

      <div className="border-t border-[#e8eeff]" />

      <div className="space-y-4">
        {/* File Type */}
        <div>
          <label className="block text-xs font-semibold text-[#6b7a9e] mb-1.5 uppercase tracking-wide">
            File Type
          </label>
          <div className="relative">
            <select
              value={fileType}
              onChange={(e) => { setFileType(e.target.value); setError(""); }}
              className="input appearance-none pr-10 cursor-pointer"
            >
              <option value="">Select file type…</option>
              {FILE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7a9e]">
              ▾
            </div>
          </div>
        </div>

        {/* File Name */}
        <div>
          <label className="block text-xs font-semibold text-[#6b7a9e] mb-1.5 uppercase tracking-wide">
            File Name
          </label>
          <input
            type="text"
            placeholder="e.g. Ankit's Lab Report for Typhoid"
            value={fileName}
            onChange={(e) => { setFileName(e.target.value); setError(""); }}
            className="input"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-xs font-semibold text-[#6b7a9e] mb-1.5 uppercase tracking-wide">
            Choose File
          </label>
          <div
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
              selectedFile
                ? "border-[#2d4ecf] bg-[#f0f4ff]"
                : "border-[#dde4f5] hover:border-[#2d4ecf] bg-[#f8faff]"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? (
              <div>
                <p className="text-[#2d4ecf] font-semibold text-sm">
                  📎 {selectedFile.name}
                </p>
                <p className="text-xs text-[#6b7a9e] mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB — click to change
                </p>
              </div>
            ) : (
              <div>
                <p className="text-[#6b7a9e] text-sm">
                  Drop file here or{" "}
                  <span className="text-[#2d4ecf] font-semibold">browse</span>
                </p>
                <p className="text-xs text-[#9aa5c4] mt-1">PDF, JPG, PNG, WebP</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-xs bg-green-50 border border-green-100 rounded-lg px-3 py-2">
          ✓ {success}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="btn-primary w-full"
      >
        {uploading ? "Uploading…" : "Submit Record"}
      </button>
    </div>
  );
}
