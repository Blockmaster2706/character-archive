export function putCharacterInLocalstorage(characterSlug: string) {
  const recentRaw = localStorage.getItem("recentCharacters");
  const recent = recentRaw ? JSON.parse(recentRaw) : [];
  const updatedRecent = [
    characterSlug,
    ...recent.filter((slug: string) => slug !== characterSlug),
  ].slice(0, 5); // Keep only the 5 most recent
  localStorage.setItem("recentCharacters", JSON.stringify(updatedRecent));
}
