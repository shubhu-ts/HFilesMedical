"use client";

import { useState, useRef } from "react";
import { updateProfile, uploadProfileImage, UserProfile } from "@/lib/api";

interface UserProfilePanelProps {
  user: UserProfile;
  onUpdate: (updated: UserProfile) => void;
}

type Gender = "Male" | "Female";

export default function UserProfilePanel({ user, onUpdate }: UserProfilePanelProps) {
  const [form, setForm] = useState({
    email: user.email,
    gender: user.gender as Gender,
    phoneNumber: user.phoneNumber,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imgUploading, setImgUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
    setError("");
  };

  const handleGender = (g: Gender) => {
    setForm({ ...form, gender: g });
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await updateProfile(form);
      onUpdate(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update profile.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const res = await uploadProfileImage(file);
      onUpdate({ ...user, profileImageUrl: res.data.imageUrl });
    } catch {
      setError("Image upload failed.");
    } finally {
      setImgUploading(false);
    }
  };

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="card p-6 flex flex-col gap-5">
      {/* Patient Code Badge */}
      <div className="flex justify-end">
        <span className="bg-[#f0f4ff] text-[#2d4ecf] text-xs font-bold px-3 py-1 rounded-full tracking-widest border border-[#dde4f5]">
          {user.patientCode}
        </span>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#2d4ecf] flex items-center justify-center text-white text-2xl font-bold overflow-hidden ring-4 ring-[#e8eeff]">
            {user.profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          {imgUploading && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">…</span>
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-[#1a2340] text-lg">{user.fullName}</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xs text-[#2d4ecf] hover:underline font-semibold"
        >
          Change photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-[#e8eeff]" />

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#6b7a9e] mb-1.5 uppercase tracking-wide">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#6b7a9e] mb-1.5 uppercase tracking-wide">
            Phone
          </label>
          <input
            name="phoneNumber"
            type="tel"
            value={form.phoneNumber}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#6b7a9e] mb-2 uppercase tracking-wide">
            Gender
          </label>
          <div className="flex gap-2">
            {(["Male", "Female"] as Gender[]).map((g) => (
              <label
                key={g}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border cursor-pointer text-sm font-semibold transition-all ${
                  form.gender === g
                    ? "bg-[#2d4ecf] text-white border-[#2d4ecf]"
                    : "bg-[#f8faff] text-[#6b7a9e] border-[#dde4f5] hover:border-[#2d4ecf]"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={() => handleGender(g)}
                  className="hidden"
                />
                {g}
              </label>
            ))}
          </div>
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
          ✓ Profile saved successfully!
        </p>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full mt-auto"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
