import axios from "axios";

// ─── Change this to your ASP.NET backend URL ───────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends session cookies automatically
  headers: { "Content-Type": "application/json" },
});

// ── Types ──────────────────────────────────────────────────────────────────

export interface SignUpPayload {
  fullName: string;
  email: string;
  gender: "Male" | "Female";
  phoneNumber: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  email: string;
  gender: "Male" | "Female";
  phoneNumber: string;
}

export interface MedicalFile {
  id: number;
  fileType: string;
  fileName: string;
  uploadedAt: string;
  fileUrl: string;
  mimeType: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  gender: "Male" | "Female";
  phoneNumber: string;
  profileImageUrl?: string;
  patientCode: string;
}

// ── Auth ───────────────────────────────────────────────────────────────────

export const signUp = (data: SignUpPayload) =>
  api.post("/auth/signup", data);

export const login = (data: LoginPayload) =>
  api.post("/auth/login", data);

export const logout = () =>
  api.post("/auth/logout");

export const getSession = () =>
  api.get<UserProfile>("/auth/session");

// ── Profile ────────────────────────────────────────────────────────────────

export const getProfile = () =>
  api.get<UserProfile>("/user/profile");

export const updateProfile = (data: UpdateProfilePayload) =>
  api.put("/user/profile", data);

export const uploadProfileImage = (file: File) => {
  const form = new FormData();
  form.append("image", file);
  return api.post<{ imageUrl: string }>("/user/profile/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ── Medical Files ──────────────────────────────────────────────────────────

export const getFiles = () =>
  api.get<MedicalFile[]>("/files");

export const uploadFile = (fileType: string, fileName: string, file: File) => {
  const form = new FormData();
  form.append("fileType", fileType);
  form.append("fileName", fileName);
  form.append("file", file);
  return api.post<MedicalFile>("/files/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteFile = (id: number) =>
  api.delete(`/files/${id}`);

export default api;
