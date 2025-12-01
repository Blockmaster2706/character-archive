"use client";

import { CustomMenubar } from "@/components/menubar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <CustomMenubar />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Willkommen in meinem Charakter Archiv
        </h1>
        <p className="max-w-lg text-center sm:text-left">
          Dies ist ein Archiv für meine erstellten Charaktere aus verschiedenen
          Projekten. Hier kannst du sie dir anschauen.
        </p>

        <Button variant="default" onClick={() => router.push("/characters")}>
          Zu den Charakteren
        </Button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
