import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aurelia Farewell",
  description: "Aurelia Farewell Character Page",
  icons: {
    icon: "/aurelia-favicon.png",
  },
  openGraph: {
    images: ["/images/characters/aurelia/11.jpg"],
  },
};

export default function AureliaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
