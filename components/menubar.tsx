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
                const recent = recentRaw ? JSON.parse(recentRaw) : [];
                const items = recent.slice(0, 3);

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
                  window.open(
                    "https://docs.google.com/document/d/1XTCn4Ix0wWs6R--mV2VWMM5wGhxvNn9TZuja5x707iA/edit?usp=sharing",
                    "_blank"
                  );
                  break;
                case "pr3_1":
                  window.open(
                    "https://docs.google.com/document/d/1etQvt51cb8_IZ1aFwcWLfETJTXHkS7i9bvBldr27i-E/edit?usp=sharing",
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
            <MenubarRadioItem
              onSelect={() => router.push("/characters/pr3_1")}
              value="pr3_1"
            >
              PR3_1
            </MenubarRadioItem>
            <MenubarRadioItem
              onSelect={() => router.push("/characters/vesper")}
              value="vesper"
            >
              Vesper Davis [DEMO]
            </MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <ModeToggle />
    </Menubar>
  );
}
