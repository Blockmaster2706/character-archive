"use client";

import { CustomMenubar } from "@/components/menubar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VesperPage() {
  const router = useRouter();
  const [characterData, setCharacterData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            url: "https://docs.google.com/document/d/e/2PACX-1vRvzVmPTVWiF4Y8Nlg-04jHcrQslQ5j47FC69D5U--qbcrHx7bBDpg71aqDyFwZXf-320R8vZaOEe9l/pub",
            name: "Ozeria",
            docname: "Lady Ozeria - PR2",
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
        const { parseGenericCharacter } = await import("../character-parser");
        const formattedHTML = parseGenericCharacter(data.text, "Ozeria");

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
            <h1 className="text-5xl font-bold mb-2">Vesper Davis</h1>
            <p className="text-xl text-muted-foreground">Rekrut</p>
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
        </div>
      </main>
    </div>
  );
}
