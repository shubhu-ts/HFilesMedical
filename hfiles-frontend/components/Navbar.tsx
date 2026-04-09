"use client";

import { useRouter } from "next/navigation";
import { logout, UserProfile } from "@/lib/api";

interface NavbarProps {
  user: UserProfile | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    router.push("/auth/login");
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="bg-[#1a2340] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#f5a623] rounded-lg flex items-center justify-center">
            <span className="text-[#1a2340] font-bold text-base font-display">h</span>
          </div>
          <div>
            <span className="font-display font-bold text-white text-lg tracking-tight leading-none">
              hfiles
            </span>
            <p className="text-[9px] text-[#9aaac8] uppercase tracking-widest leading-none mt-0.5">
              Health Files
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden sm:block text-sm text-[#9aaac8]">
              Hi,{" "}
              <span className="text-white font-semibold">
                {user.fullName.split(" ")[0]}
              </span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-xs text-[#9aaac8] hover:text-white transition-colors border border-[#2e3a58] hover:border-[#4a5a7c] rounded-lg px-3 py-1.5"
          >
            Sign out
          </button>
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#2d4ecf] flex items-center justify-center text-white text-sm font-bold overflow-hidden">
            {user?.profileImageUrl ? (
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
        </div>
      </div>
    </header>
  );
}
