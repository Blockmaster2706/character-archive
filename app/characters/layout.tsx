import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Character Archive",
  description: "Character Archive",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function CharactersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
