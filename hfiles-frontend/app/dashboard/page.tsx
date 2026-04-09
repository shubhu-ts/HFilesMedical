"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getFiles, UserProfile, MedicalFile } from "@/lib/api";
import Navbar from "@/components/Navbar";
import UserProfilePanel from "@/components/UserProfilePanel";
import FileUploadPanel from "@/components/FileUploadPanel";
import FilesGrid from "@/components/FilesGrid";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [files, setFiles] = useState<MedicalFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, filesRes] = await Promise.all([
        getProfile(),
        getFiles(),
      ]);
      setUser(profileRes.data);
      setFiles(filesRes.data);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileUploaded = (file: MedicalFile) => {
    setFiles((prev) => [file, ...prev]);
  };

  const handleFileDeleted = (id: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#2d4ecf] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#6b7a9e] font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top Section: Profile + Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 animate-fade-up">
          {/* Left: User Profile */}
          <UserProfilePanel user={user} onUpdate={setUser} />

          {/* Right: File Upload */}
          <FileUploadPanel onUploaded={handleFileUploaded} />
        </div>

        {/* Bottom Section: Files Grid */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          <FilesGrid files={files} onDeleted={handleFileDeleted} />
        </div>
      </main>
    </div>
  );
}
