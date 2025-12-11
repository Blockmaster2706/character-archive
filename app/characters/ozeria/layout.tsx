import { AudioProvider } from "@/components/audio/provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ozeria Lavigne",
  description: "Ozeria Lavigne Character Page",
  icons: {
    icon: "/ozeria-favicon.png",
  },
  openGraph: {
    images: ["/images/characters/ozeria/11.jpg"],
  },
};

export default function OzeriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AudioProvider>{children}</AudioProvider>;
}
