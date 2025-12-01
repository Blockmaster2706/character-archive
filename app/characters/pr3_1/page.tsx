"use client";

import { CustomMenubar } from "@/components/menubar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parseGenericCharacter } from "../character-parser";

export default function VesperPage() {
  const router = useRouter();
  const [characterData, setCharacterData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const name = "Name";

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

  // Parse character sheet into sections
  const parseCharacterSections = (text: string) => {
    // Extract Name section
    const nameMatch = text.match(/Name\s+([^『]+)/);
    if (nameMatch)
      setNameSection(
        nameMatch[1]
          .trim()
          .replace(/\[.*?\]/, "")
          .trim()
      );

    const caelesteNameMatch = text.match(/Name\s*\[([^\]]+)\]/);
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

  useEffect(() => {
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

        // Parse the raw text using the character-specific parser
        const { parseCharacterDocument } = await import("../character-parser");
        const formattedHTML = parseGenericCharacter(data.text, name);

        // Parse into individual sections
        parseCharacterSections(data.text);

        setCharacterData(formattedHTML);
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
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Lade Charakterdaten...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
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
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <CustomMenubar />
      <main className="max-w-4xl mx-auto mt-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/characters")}>
            ← Zurück zu Charakteren
          </Button>
        </div>

        <div className="space-y-8">
          <header className="text-center">
            <h1 className="text-5xl font-bold mb-2">{name}</h1>
            <p className="text-xl text-muted-foreground">{caelesteName}</p>
          </header>

          <div className="bg-card p-6 rounded-lg border">
            {characterData ? (
              <div
                className="google-docs-content prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: characterData }}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No content loaded yet...
                </p>
                <p className="text-sm mt-2">
                  Check browser console for debugging info
                </p>
              </div>
            )}
          </div>

          {/* Debug: Show parsed sections */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-bold mb-4">
              Parsed Character Sections
            </h2>
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
          </div>
        </div>
      </main>
    </div>
  );
}
