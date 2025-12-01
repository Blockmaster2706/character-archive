"use client";

import { CustomMenubar } from "@/components/menubar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { characters } from "./characters";

export default function Home() {
  const router = useRouter();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <CustomMenubar />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Charaktere
        </h1>

        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 w-full gap-4">
            {characters.map((c) => (
              <Button
                key={c.slug}
                onClick={() => router.push(`/characters/${c.slug}`)}
                className="p-0 text-left rounded-lg overflow-hidden shadow-sm hover:shadow-md transition h-20"
                variant="ghost"
              >
                <div className="flex items-center gap-8 p-4 w-full">
                  <Image
                    src={c.image}
                    alt={c.name}
                    width={128}
                    height={128}
                    className="w-16 h-16 rounded-md object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <div className="text-lg font-medium">{c.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Charakter anzeigen
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
