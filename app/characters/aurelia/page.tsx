"use client";

import { CustomMenubar } from "@/components/menubar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { putCharacterInLocalstorage } from "../localstorage";
import { Card, CardContent } from "@/components/ui/card";
import TypingText from "@/components/ui/shadcn-io/typing-text";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function PR3_1Page() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalTheme, setOriginalTheme] = useState<string | undefined>();

  const name = "aurelia";

  // Force dark mode on this page, but preserve original theme
  useEffect(() => {
    // Store the original theme when component mounts
    if (theme && !originalTheme) {
      setOriginalTheme(theme);
    }
    // Set to dark mode
    setTheme("dark");

    // Restore original theme when component unmounts
    return () => {
      if (originalTheme) {
        setTheme(originalTheme);
      }
    };
  }, [theme, setTheme, originalTheme]);

  // Character section states
  const [nameSection, setNameSection] = useState<string>("");
  const [basicInfoSection, setBasicInfoSection] = useState<
    Record<string, string>
  >({});
  const [caelesteName, setCaelesteName] = useState<string>("");
  const [caelesteSection, setCaelesteSection] = useState<string>("");
  const [aussehenSection, setAussehenSection] = useState<
    Record<string, string>
  >({});
  const [inventarSection, setInventarSection] = useState<string>("");
  const [kleidungSection, setKleidungSection] = useState<
    Record<string, string>
  >({});
  const [persoenlichkeitSection, setPersoenlichkeitSection] =
    useState<string>("");
  const [persoenlichkeitsmerkmaleSection, setPersoenlichkeitsmerkmaleSection] =
    useState<Record<string, string>>({});
  const [geschichteSection, setGeschichteSection] = useState<string>("");
  const [beziehungenSection, setBeziehungenSection] = useState<string>("");

  // Helper function to parse section content
  const parseSectionContent = (
    sectionText: string
  ): string | Record<string, string> => {
    const arrows = sectionText.match(/►[^►]+/g);
    if (!arrows || arrows.length === 0) return "";

    if (arrows.length === 1) {
      // Single arrow - return just the text after the arrow
      const content = arrows[0].replace(/^►\s*/, "").trim();
      return content;
    } else {
      // Multiple arrows - return object with key-value pairs
      const result: Record<string, string> = {};
      arrows.forEach((arrow) => {
        const match = arrow.match(/^►\s*([^:]+):\s*(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          result[key] = value;
        }
      });
      return result;
    }
  };

  useEffect(() => {
    // Parse character sheet into sections
    const parseCharacterSections = (text: string) => {
      // Extract Name section
      const nameMatch = text.match(/\s+([^『]+)/);
      if (nameMatch)
        setNameSection(
          nameMatch[1]
            .trim()
            .replace(/\[.*?\]/, "")
            .replace(/\-.*\- PR3/, "")
            .replace("Updated automatically every 5 minutes", "")
            .replace("Automatisch alle 5 Minuten aktualisiert", "")
            .trim()
        );

      const caelesteNameMatch = text.match(/\s*\[([^\]]+)\]/);
      if (caelesteNameMatch) setCaelesteName(caelesteNameMatch[1].trim());

      // Extract Basic Info section
      const basicInfoMatch = text.match(/『Basic Info』([\s\S]*?)(?=『|$)/);
      if (basicInfoMatch) {
        const parsed = parseSectionContent(basicInfoMatch[1]);
        if (typeof parsed === "object") setBasicInfoSection(parsed);
      }

      // Extract Caeleste section (single arrow)
      const caelesteMatch = text.match(/『Caeleste』([\s\S]*?)(?=『|$)/);
      if (caelesteMatch) {
        const parsed = parseSectionContent(caelesteMatch[1]);
        if (typeof parsed === "string") setCaelesteSection(parsed);
      }

      // Extract Aussehen section
      const aussehenMatch = text.match(/『Aussehen』([\s\S]*?)(?=『|$)/);
      if (aussehenMatch) {
        const parsed = parseSectionContent(aussehenMatch[1]);
        if (typeof parsed === "object") setAussehenSection(parsed);
      }

      // Extract Inventar section (single arrow)
      const inventarMatch = text.match(/『Inventar』([\s\S]*?)(?=『|$)/);
      if (inventarMatch) {
        const parsed = parseSectionContent(inventarMatch[1]);
        if (typeof parsed === "string") setInventarSection(parsed);
      }

      // Extract Kleidung section
      const kleidungMatch = text.match(/『Kleidung』([\s\S]*?)(?=『|$)/);
      if (kleidungMatch) {
        const parsed = parseSectionContent(kleidungMatch[1]);
        if (typeof parsed === "object") setKleidungSection(parsed);
      }

      // Extract Persönlichkeit section (single arrow)
      const persoenlichkeitMatch = text.match(
        /『Persönlichkeit』([\s\S]*?)(?=『|$)/
      );
      if (persoenlichkeitMatch) {
        const parsed = parseSectionContent(persoenlichkeitMatch[1]);
        if (typeof parsed === "string") setPersoenlichkeitSection(parsed);
      }

      // Extract Persönlichkeitsmerkmale section
      const persoenlichkeitsmerkmaleMatch = text.match(
        /『Persönlichkeitsmerkmale』([\s\S]*?)(?=『|$)/
      );
      if (persoenlichkeitsmerkmaleMatch) {
        const parsed = parseSectionContent(persoenlichkeitsmerkmaleMatch[1]);
        if (typeof parsed === "object")
          setPersoenlichkeitsmerkmaleSection(parsed);
      }

      // Extract Geschichte section (single arrow)
      const geschichteMatch = text.match(/『Geschichte』([\s\S]*?)(?=『|$)/);
      if (geschichteMatch) {
        const parsed = parseSectionContent(geschichteMatch[1]);
        if (typeof parsed === "string") setGeschichteSection(parsed);
      }

      // Extract Beziehungen section (single arrow)
      const beziehungenMatch = text.match(/『Beziehungen』([\s\S]*?)(?=『|$)/);
      if (beziehungenMatch) {
        const parsed = parseSectionContent(beziehungenMatch[1]);
        if (typeof parsed === "string") setBeziehungenSection(parsed);
      }
    };

    putCharacterInLocalstorage("aurelia");

    const fetchCharacterData = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/fetch-doc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: "https://docs.google.com/document/d/e/2PACX-1vSCm4fHqGfj4wErq_5dt6xkSMRHLCR-Hx8LtIUvUKV-n5gcIjQ5CLO84jqWKpxmY8E5WQKjJ-c4JP0h/pub",
            name: name,
            docname: `${name} - PR3`,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch document: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();
        console.log("Received raw text length:", data.length);
        console.log("Received raw text preview:", data.text.substring(0, 200));

        // Parse into individual sections
        parseCharacterSections(data.text);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load character data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterData();
  }, []);

  const [showAnimation, setShowAnimation] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const animationContent: string = `Ein leiser Kamin knistert im Hintergrund.
Der Duft von Espresso erfüllt den Raum.
Draußen fallen die ersten Blätter, und werden vom Wind verweht.
"Willkommen zurück," sagt eine vertraute Stimme.
Du blickst zu ihr, und dein Blick trifft auf zwei nussbraune Augen.`;

  useEffect(() => {
    setTimeout(() => {
      setShowAnimation(true);
    }, 100);
    setTimeout(() => {
      setShowSheet(true);
    }, 20500);
  }, []);

  const imagesArray = [
    "/images/characters/aurelia/1.jpg",
    "/images/characters/aurelia/2.jpg",
    "/images/characters/aurelia/3.jpg",
    "/images/characters/aurelia/4.jpg",
    "/images/characters/aurelia/5.jpg",
  ];

  if (loading) {
    return (
      <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <CustomMenubar />
        <main className="max-w-4xl mx-auto mt-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/characters")}
            >
              ← Zurück zu Charakteren
            </Button>
          </div>

          <div
            className={`${
              loading ? "opacity-100 pointer-events-none" : "opacity-0"
            } absolute top-0 left-0 w-screen h-screen bg-black transition-opacity duration-300 z-50`}
          >
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-500"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <CustomMenubar />
        <main className="max-w-4xl max-h-screen mx-auto mt-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/characters")}
            >
              ← Zurück zu Charakteren
            </Button>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">
              Fehler beim Laden der Charakterdaten:
            </p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Erneut versuchen
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={"font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-orange-950" + (!showSheet ? " max-h-screen overflow-hidden" : "")}>
      <CustomMenubar />
      <main className="max-w-4xl mx-auto mt-8 z-0">
        <div
          className={`absolute top-16 sm:top-20 left-0 w-full bg-orange-950 transition-opacity duration-[1500ms] ${
            !showSheet
              ? `opacity-100 z-40 pointer-events-auto`
              : "opacity-0 z-40 pointer-events-none"
          }`}
        >
           
            <div className="animate-fade-out pointer-events-none p-8 sm:p-20 h-screen">
              <Card className="p-6 bg-black/10 backdrop-blur-sm">
                <div className="text-lg font-mono flex items-center gap-2">
                  <span>
                    <TypingText text={animationContent}></TypingText>
                  </span>
                </div>
              </Card>
            </div>
          
        </div>
        <div
          className={`opacity-100 ${
            loading ? "pointer-events-none z-50" : "opacity-0 -z-50"
          } absolute top-0 left-0 w-screen h-screen bg-gray-900 transition-opacity duration-500`}
        ></div>
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/characters")}>
            ← Zurück zu Charakteren
          </Button>
        </div>

          <Carousel
            className="absolute w-screen left-0 mb-20"
            opts={{ loop: true, dragFree: true }}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
              }),
            ]}
          >
            <CarouselContent>
              {imagesArray.map((imgSrc, index) => {
                return (
                  <CarouselItem
                    key={index}
                    className="basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="p-1">
                      <Card className="bg-black/10 backdrop-blur-sm border border-white/10">
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <Image
                            className="aspect-square object-cover rounded-lg"
                            src={imgSrc}
                            alt={`Image ${index + 1}`}
                            fill
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        <div className="space-y-8 mt-20">

          <Card className="text-center sm:w-[40%] m-auto mb-8 bg-black/10 backdrop-blur-sm">
            <h1 className="text-5xl font-bold mb-2">{nameSection}</h1>
            <p className="text-xl text-muted-foreground">{caelesteName}</p>
          </Card>

          {/* Debug: Show parsed sections */}
          <Card className="p-6 mt-20 sm:mt-30 bg-black/10 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nameSection && (
                <div className="border p-3 rounded">
                  <h3 className="font-bold">tName</h3>
                  <pre className="text-sm whitespace-pre-wrap">
                    {nameSection}
                  </pre>
                </div>
              )}
              {Object.keys(basicInfoSection).length > 0 && (
                <div className="border p-3 rounded">
                  <h3 className="font-bold">tBasic Info</h3>
                  <div className="text-sm space-y-1">
                    {Object.entries(basicInfoSection).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">t{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {caelesteSection && (
                <div className="border p-3 rounded">
                  <h3 className="font-bold">tCaeleste</h3>
                  <div className="text-sm">
                    <div>
                      <span className="font-medium">tName:</span> {caelesteName}
                    </div>
                    <div>
                      <span className="font-medium">tContent:</span>{" "}
                      {caelesteSection}
                    </div>
                  </div>
                </div>
              )}
              {Object.keys(aussehenSection).length > 0 && (
                <div className="border p-3 rounded">
                  <h3 className="font-bold">tAussehen</h3>
                  <div className="text-sm space-y-1">
                    {Object.entries(aussehenSection).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">t{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {inventarSection && (
                <div className="border p-3 rounded">
                  <h3 className="font-bold">tInventar</h3>
                  <div className="text-sm">{inventarSection}</div>
                </div>
              )}
              {Object.keys(kleidungSection).length > 0 && (
                <div className="border p-3 rounded">
                  <h3 className="font-bold">tKleidung</h3>
                  <div className="text-sm space-y-1">
                    {Object.entries(kleidungSection).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">t{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {persoenlichkeitSection && (
                <div className="border p-3 rounded">
                  <h3 className="font-bold">tPersönlichkeit</h3>
                  <div className="text-sm">{persoenlichkeitSection}</div>
                </div>
              )}
              {Object.keys(persoenlichkeitsmerkmaleSection).length > 0 && (
                <div className="border p-3 rounded">
                  <h3 className="font-bold">Persönlichkeitsmerkmale</h3>
                  <div className="text-sm space-y-1">
                    {Object.entries(persoenlichkeitsmerkmaleSection).map(
                      ([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">t{key}:</span> {value}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
              {geschichteSection && (
                <div className="border p-3 rounded">
                  <h3 className="font-bold">Geschichte</h3>
                  <div className="text-sm">{geschichteSection}</div>
                </div>
              )}
              {beziehungenSection && (
                <div className="border p-3 rounded">
                  <h3 className="font-bold">Beziehungen</h3>
                  <div className="text-sm">{beziehungenSection}</div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
