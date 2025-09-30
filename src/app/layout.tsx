import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Providers from "./providers";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "رهاب گستر",
  description: "وبسایت شخصی رهاب گستر سبز مازند",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} ${vazirmatn.className} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster style={{ fontFamily: "unset" }} />
      </body>
    </html>
  );
}
