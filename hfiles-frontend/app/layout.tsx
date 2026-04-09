import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HFiles – Medical Record Dashboard",
  description: "Securely manage your medical records in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
