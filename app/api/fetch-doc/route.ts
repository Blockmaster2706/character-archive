import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url, name, docname } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Simpler, more robust extraction
    const extractCharacterText = (
      html: string,
      characterName?: string
    ): string => {
      console.log("Starting extraction, HTML length:", html.length);
      console.log("Looking for character:", characterName);

      // Step 1: Remove JavaScript completely first
      const cleanHtml = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

      console.log("After removing scripts/styles, length:", cleanHtml.length);

      // Step 2: Convert to text before any further processing
      let fullText = cleanHtml
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

      console.log("After HTML to text, length:", fullText.length);

      if (fullText.length === 0) {
        console.log("No text found, returning empty");
        return "";
      }

      console.log("Preview:", fullText.substring(0, 300));

      // Step 3: Clean up JavaScript patterns that might remain
      fullText = fullText
        .replace(/_F_toggles_initialize[\s\S]*$/g, "")
        .replace(docname, "")
        .replace("Automatisch alle 5 Minuten aktualisiert", "")
        .replace(docname, "")
        .trim();

      console.log("After JS cleanup, length:", fullText.length);
      console.log("Preview:", fullText.substring(0, 300));

      // Step 4: If character name provided, try to extract their section
      if (characterName && fullText.length > 0) {
        console.log(`Searching for character: ${characterName}`);

        const characterIndex = fullText
          .toLowerCase()
          .indexOf(characterName.toLowerCase());
        if (characterIndex !== -1) {
          console.log(`Found character at index: ${characterIndex}`);

          // Extract from character name to end, but stop at JavaScript
          let characterText = fullText.substring(characterIndex);

          // Look for JavaScript patterns and stop there
          const jsIndex = characterText.search(
            /(function\s+\w|var\s+\w|\(\s*function|\w+\s*=\s*function)/
          );
          if (jsIndex !== -1) {
            characterText = characterText.substring(0, jsIndex);
            console.log(`Stopped at JS pattern at index ${jsIndex}`);
          }

          characterText = characterText.trim();
          console.log(`Character section length: ${characterText.length}`);

          if (characterText.length > 20) {
            return characterText;
          }
        } else {
          console.log(`Character "${characterName}" not found in text`);
        }
      }

      console.log("Returning full text");
      return fullText;
    };

    const rawText = extractCharacterText(html, name);

    // Return as JSON so clients can parse it as needed
    return NextResponse.json({
      text: rawText,
      length: rawText.length,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      {
        error: `Failed to fetch document: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
