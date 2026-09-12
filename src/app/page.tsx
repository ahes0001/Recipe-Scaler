"use client";

import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Calculator from "@/components/Calculator";
import Footer from "@/components/Footer";

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
        <Navbar onOpenSettings={() => setSettingsOpen(true)} />
        <main className="flex-1">
          <Calculator settingsOpen={settingsOpen} onCloseSettings={() => setSettingsOpen(false)} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
