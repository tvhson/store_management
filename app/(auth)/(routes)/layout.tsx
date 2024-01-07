import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "SManager",
  description: "Generated by Next.js",
  icons: ["/web_avatar.png"],
};

import Background from "@/components/component/background";
import { Open_Sans } from "next/font/google";
const font = Open_Sans({ subsets: ["latin"] });

export default function SubRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen items-center justify-center bg-white">
          <Background />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
