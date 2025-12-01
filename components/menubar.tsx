"use client";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
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
                const items = recentRaw ? JSON.parse(recentRaw) : [];

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
                    {items.map((ch: any, i: number) => {
                      ch = characters.find((c) => c.slug === ch) || ch;
                      const id = ch.id ?? ch.slug ?? ch.name ?? `char-${i}`;
                      const label = ch.name ?? ch;
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
