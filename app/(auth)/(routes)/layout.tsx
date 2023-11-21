import "../../globals.css";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

import { Open_Sans } from "next/font/google";
const font = Open_Sans({ subsets: ["latin"] });

export default function SubRootLayout({
  children,
} : {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body>
          <div className="h-screen flex justify-center items-center">
            {children}
          </div>
        </body>
      </html>
  );
}
