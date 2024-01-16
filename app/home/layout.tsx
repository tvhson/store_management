"use client";

import { useState } from "react";
import "../home/styles/index.css";
import Footer from "./footer";
import Header from "./header";
import { Providers } from "./providers";
import ScrollToTop from "./scroll-to-top";
import Preloader from "@/components/ui/preloader";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SManager",
  description: "Generated by Next.js",
  icons: ["/web_avatar.png"],
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //show preloader after click login button
  const [showPreloader, setShowPreloader] = useState(false);
  const ShowPreloader = () => {
    setShowPreloader(true);
  };

  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className="dark:bg-dark">
        <Providers>
          {showPreloader ? (
            <div className="fixed left-0 top-0 z-[99999] h-screen w-screen">
              <Preloader />
            </div>
          ) : null}
          <Header showPreloader={ShowPreloader} />
          {children}
          {/* <Footer /> */}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
