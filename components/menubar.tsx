"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ModeToggle } from "./mode-toggle";
import { useRouter } from "next/navigation";
import { characters } from "@/app/characters/characters";

export function CustomMenubar() {
  const router = useRouter();
  const characterSlug =
    typeof window !== "undefined"
      ? decodeURIComponent(
          (window.location.pathname
            .split("/")
            .filter(Boolean)
            .pop() as string) ?? "none"
        )
      : "none";

  return (
    <Menubar className="absolute top-4 left-4">
      <MenubarMenu>
        <MenubarTrigger>Datei</MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            disabled={
              characterSlug === "none" || characterSlug === "characters"
            }
            onClick={() => router.push("/characters")}
          >
            Schließen
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Zurück zu</MenubarSubTrigger>
            <MenubarSubContent>
              {(() => {
                const recentRaw =
                  typeof window !== "undefined"
                    ? localStorage.getItem("recentCharacters")
                    : null;
                const items: string[] = recentRaw ? JSON.parse(recentRaw) : [];

                if (items.length === 0) {
                  return (
                    <>
                      <MenubarItem disabled>
                        Keine zuletzt besuchten Charaktere
                      </MenubarItem>
                    </>
                  );
                }

                return (
                  <>
                    {items.map((ch: string, i: number) => {
                      const new_ch = characters.find((c) => c.slug === ch) || {
                        id: ch,
                        slug: ch,
                        name: ch,
                      };
                      const id = new_ch.slug ?? new_ch.name ?? `char-${i}`;
                      const label = new_ch.name ?? new_ch;
                      return (
                        <MenubarItem
                          key={id}
                          onSelect={() => {
                            if (typeof window !== "undefined") {
                              window.location.href = `/characters/${id}`;
                            }
                          }}
                        >
                          {label}
                        </MenubarItem>
                      );
                    })}
                  </>
                );
              })()}
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem
            disabled={
              characterSlug === "none" || characterSlug === "characters"
            }
            onClick={() => {
              switch (characterSlug) {
                case "vesper":
                case "pr3_1":
                  window.open(
                    characters.find((c) => c.slug === characterSlug)?.doclink ||
                      "",
                    "_blank"
                  );
                  break;
                default:
                  break;
              }
            }}
          >
            In Google Docs öffnen
          </MenubarItem>
          <MenubarSeparator />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Charaktere</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={characterSlug}>
            {characters.map((c) => (
              <MenubarRadioItem
                key={c.slug}
                onSelect={() => router.push(`/characters/${c.slug}`)}
                value={c.slug}
              >
                {c.name}
              </MenubarRadioItem>
            ))}
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <ModeToggle />
    </Menubar>
  );
}
