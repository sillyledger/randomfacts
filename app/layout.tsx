import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Random Facts",
  description: "A daily dose of surprising facts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} font-sans antialiased bg-pageBg`}>
        {children}
      </body>
    </html>
  );
}
