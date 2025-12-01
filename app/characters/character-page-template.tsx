"use client";

import { CustomMenubar } from "@/components/menubar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAndParseCharacter } from "./character-parser";

interface CharacterPageProps {
  characterName: string;
  documentUrl: string;
  docName?: string;
}

export default function CharacterPageTemplate({
  characterName,
  documentUrl,
  docName = "Character Archive",
}: CharacterPageProps) {
  const router = useRouter();
  const [characterData, setCharacterData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacterData = async () => {
      try {
        setLoading(true);
        const formattedHTML = await fetchAndParseCharacter(
          documentUrl,
          characterName,
          docName
        );
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

    loadCharacterData();
  }, [characterName, documentUrl, docName]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <CustomMenubar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            onClick={() => router.push("/characters")}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
          >
            ← Back to Characters
          </Button>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 shadow-2xl">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <span className="ml-4 text-lg">Loading character data...</span>
            </div>
          ) : error ? (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-400 mb-2">
                Error Loading Character
              </h2>
              <p className="text-red-300">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div
              className="google-docs-content"
              dangerouslySetInnerHTML={{ __html: characterData }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
