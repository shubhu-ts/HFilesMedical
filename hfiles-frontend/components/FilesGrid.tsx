"use client";

import { MedicalFile } from "@/lib/api";
import FileCard from "./FileCard";

interface FilesGridProps {
  files: MedicalFile[];
  onDeleted: (id: number) => void;
}

export default function FilesGrid({ files, onDeleted }: FilesGridProps) {
  if (files.length === 0) {
    return (
      <div className="card p-10 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#f0f4ff] rounded-2xl flex items-center justify-center mb-4">
          <span className="text-3xl">🗂️</span>
        </div>
        <h3 className="font-display font-bold text-[#1a2340] text-lg mb-2">
          No records yet
        </h3>
        <p className="text-sm text-[#6b7a9e] max-w-xs">
          Upload your first medical record using the form above. Files you add
          will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-[#1a2340] text-lg">
          Your Records
          <span className="ml-2 text-sm font-normal text-[#6b7a9e]">
            ({files.length} file{files.length !== 1 ? "s" : ""})
          </span>
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {files.map((f) => (
          <FileCard key={f.id} file={f} onDeleted={onDeleted} />
        ))}
      </div>
    </div>
  );
}
