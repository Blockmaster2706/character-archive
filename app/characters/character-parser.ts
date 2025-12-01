// Utility functions for parsing character documents

export interface CharacterSection {
  type: "header" | "content";
  text: string;
}

export function parseVesperCharacter(rawText: string): string {
  console.log("Parsing Vesper character, text length:", rawText.length);

  // Find the start of actual content (after the Google Docs header)
  const contentStart = rawText.indexOf("Vesper Davis");
  if (contentStart === -1) {
    return `<div class="text-red-500">Could not find character content in document</div>`;
  }

  const characterContent = rawText.substring(contentStart);

  // Start building HTML
  let formattedHTML = `<h1 class="text-3xl font-bold text-green-500 mb-6">Vesper Davis</h1>\n`;

  // Clean up the content and remove the header stuff
  let content = characterContent
    .replace("Vesper Davis", "")
    .replace("Leiterbahn", "")
    .trim();

  // Add subtitle if "Leiterbahn" was found
  if (characterContent.includes("Leiterbahn")) {
    formattedHTML += `<p class="text-lg text-green-400 mb-6">Leiterbahn</p>\n`;
  }

  // Split content into parts using section headers
  const parts = content.split(/(『[^』]+』)/);

  for (const part of parts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    // Check if this is a section header
    if (trimmedPart.startsWith("『") && trimmedPart.endsWith("』")) {
      const sectionTitle = trimmedPart.slice(1, -1); // Remove brackets
      formattedHTML += `<h2 class="text-2xl font-bold text-green-500 mb-4 mt-6">${sectionTitle}</h2>\n`;
    } else {
      // This is content for a section
      const lines = trimmedPart.split(/(?=►)|(?=●)/).filter((l) => l.trim());

      if (
        lines.length === 1 &&
        !lines[0].startsWith("►") &&
        !lines[0].startsWith("●")
      ) {
        // Single long paragraph - split into sentences
        const text = lines[0].trim();
        if (text.length > 50) {
          const sentences = text.match(/[^.!?]+[.!?]+/g);
          if (sentences && sentences.length > 1) {
            for (const sentence of sentences) {
              const trimmed = sentence.trim();
              if (trimmed.length > 10) {
                formattedHTML += `<p class="mb-4 leading-relaxed">${trimmed}</p>\n`;
              }
            }
          } else {
            formattedHTML += `<p class="mb-4 leading-relaxed">${text}</p>\n`;
          }
        } else if (text.length > 0) {
          formattedHTML += `<p class="mb-2">${text}</p>\n`;
        }
      } else {
        // Multiple items or items with ►/●
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (trimmedLine.startsWith("►")) {
            // Split multiple ► items on the same line
            const items = trimmedLine.split("►").filter((item) => item.trim());
            for (const item of items) {
              const trimmedItem = item.trim();
              if (trimmedItem) {
                formattedHTML += `<p class="mb-2"><span class="text-green-400 font-medium">►${trimmedItem}</span></p>\n`;
              }
            }
          } else if (trimmedLine.startsWith("●")) {
            formattedHTML += `<p class="mb-1 ml-4"><span class="text-green-300">${trimmedLine}</span></p>\n`;
          } else if (trimmedLine.length > 10) {
            formattedHTML += `<p class="mb-3 leading-relaxed">${trimmedLine}</p>\n`;
          }
        }
      }
    }
  }

  console.log("Generated HTML length:", formattedHTML.length);

  // Fallback if formatting failed
  if (formattedHTML.length < 200) {
    formattedHTML = `
      <h1 class="text-3xl font-bold text-green-500 mb-6">Vesper Davis</h1>
      <div class="space-y-4">
        <div class="bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
          <p class="text-sm">Formatting failed, showing raw content:</p>
        </div>
        <div class="whitespace-pre-wrap leading-relaxed text-sm">${characterContent.substring(
          0,
          3000
        )}</div>
      </div>
    `;
  }

  return formattedHTML;
}

// Generic character parser that can be extended for different layouts
export function parseGenericCharacter(
  rawText: string,
  characterName: string
): string {
  console.log(`Parsing ${characterName}, text length:`, rawText.length);

  const contentStart = rawText.indexOf(characterName);
  if (contentStart === -1) {
    return `<div class="text-red-500">Could not find character content for ${characterName}</div>`;
  }

  const characterContent = rawText.substring(contentStart);

  let formattedHTML = `<h1 class="text-3xl font-bold text-green-500 mb-6">${characterName}</h1>\n`;

  // Basic parsing for any character
  const lines = characterContent.split("\n").filter((line) => line.trim());

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine === characterName) continue;

    if (trimmedLine.startsWith("『") && trimmedLine.endsWith("』")) {
      const sectionTitle = trimmedLine.slice(1, -1);
      formattedHTML += `<h2 class="text-2xl font-bold text-green-500 mb-4 mt-6">${sectionTitle}</h2>\n`;
    } else if (trimmedLine.startsWith("►")) {
      formattedHTML += `<p class="mb-2"><span class="text-green-400 font-medium">${trimmedLine}</span></p>\n`;
    } else if (trimmedLine.startsWith("●")) {
      formattedHTML += `<p class="mb-1 ml-4"><span class="text-green-300">${trimmedLine}</span></p>\n`;
    } else if (trimmedLine.length > 10) {
      formattedHTML += `<p class="mb-4 leading-relaxed">${trimmedLine}</p>\n`;
    }
  }

  return formattedHTML;
}

// Generic character parser that can work with any character
export function parseCharacterDocument(
  rawText: string,
  characterName: string
): string {
  console.log(
    `Parsing character document for: ${characterName}, text length:`,
    rawText.length
  );

  // If the text doesn't contain the character name, return error
  if (!rawText.toLowerCase().includes(characterName.toLowerCase())) {
    return `<div class="text-red-500">Could not find character "${characterName}" in document</div>`;
  }

  // Start building HTML
  let formattedHTML = `<h1 class="text-3xl font-bold text-green-500 mb-6">${characterName}</h1>\n`;

  // Clean up the content
  let content = rawText.trim();

  // Split content into parts using section headers (『』 brackets)
  const parts = content.split(/(『[^』]+』)/);

  for (const part of parts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    // Check if this is a section header
    if (trimmedPart.startsWith("『") && trimmedPart.endsWith("』")) {
      const sectionTitle = trimmedPart.slice(1, -1); // Remove brackets
      formattedHTML += `<h2 class="text-2xl font-bold text-green-500 mb-4 mt-6">${sectionTitle}</h2>\n`;
    } else {
      // This is content for a section
      const lines = trimmedPart.split(/(?=►)|(?=●)/).filter((l) => l.trim());

      if (
        lines.length === 1 &&
        !lines[0].startsWith("►") &&
        !lines[0].startsWith("●")
      ) {
        // Single line of content, probably description or name
        const line = lines[0].trim();
        if (line && line.length > 3) {
          formattedHTML += `<p class="mb-4 leading-relaxed">${line}</p>\n`;
        }
      } else {
        // Multiple items or bulleted content
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("►")) {
            formattedHTML += `<p class="mb-2"><span class="text-green-400 font-medium">${trimmedLine}</span></p>\n`;
          } else if (trimmedLine.startsWith("●")) {
            formattedHTML += `<p class="mb-1 ml-4"><span class="text-green-300">${trimmedLine}</span></p>\n`;
          } else if (trimmedLine.length > 10) {
            formattedHTML += `<p class="mb-4 leading-relaxed">${trimmedLine}</p>\n`;
          }
        }
      }
    }
  }

  return formattedHTML;
}

// Utility function to fetch and parse any character
export async function fetchAndParseCharacter(
  documentUrl: string,
  characterName: string,
  docName?: string
): Promise<string> {
  try {
    const response = await fetch("/api/fetch-doc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: documentUrl,
        name: characterName,
        docname: docName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.status}`);
    }

    const data = await response.json();
    return parseCharacterDocument(data.text, characterName);
  } catch (error) {
    console.error("Error fetching character:", error);
    return `<div class="text-red-500">Error loading character: ${
      error instanceof Error ? error.message : "Unknown error"
    }</div>`;
  }
}
