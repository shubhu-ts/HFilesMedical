"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/api";

type Gender = "Male" | "Female";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    gender: "Male" as Gender,
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleGender = (g: Gender) => setForm({ ...form, gender: g });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signUp({
        fullName: form.fullName,
        email: form.email,
        gender: form.gender,
        phoneNumber: form.phoneNumber,
        password: form.password,
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Sign-up failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center px-4 py-10">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2d4ecf]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#f5a623]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#1a2340] rounded-xl flex items-center justify-center">
            <span className="text-[#f5a623] font-bold text-lg font-display">h</span>
          </div>
          <div>
            <span className="font-display font-bold text-[#1a2340] text-xl tracking-tight">hfiles</span>
            <p className="text-[10px] text-[#6b7a9e] uppercase tracking-widest leading-none">
              Health Files
            </p>
          </div>
        </div>

        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-[#1a2340] mb-1">
            Create account
          </h1>
          <p className="text-sm text-[#6b7a9e] mb-7">
            Set up your medical record profile.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#1a2340] mb-1.5 uppercase tracking-wide">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                placeholder="Ankit Kumar"
                value={form.fullName}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#1a2340] mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-[#1a2340] mb-2 uppercase tracking-wide">
                Gender
              </label>
              <div className="flex gap-3">
                {(["Male", "Female"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGender(g)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                      form.gender === g
                        ? "bg-[#2d4ecf] text-white border-[#2d4ecf]"
                        : "bg-[#f8faff] text-[#6b7a9e] border-[#dde4f5] hover:border-[#2d4ecf]"
                    }`}
                  >
                    {g === "Male" ? "♂ Male" : "♀ Female"}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-[#1a2340] mb-1.5 uppercase tracking-wide">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={form.phoneNumber}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#1a2340] mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#1a2340] mb-1.5 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6b7a9e]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#2d4ecf] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
