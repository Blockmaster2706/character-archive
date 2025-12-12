import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerControlGroup,
  AudioPlayerPlay,
  AudioPlayerSeekBar,
  AudioPlayerTimeDisplay,
  AudioPlayerVolume,
} from "@/components/audio/player";
import { Track } from "@/lib/audio";
import { useAudioStore } from "@/lib/audio-store";
import Image from "next/image";
import { useEffect } from "react";

export default function AussehenInfoSection({
  subSectionClassName,
  aussehenInfoSection,
}: {
  subSectionClassName: string;
  aussehenInfoSection: Record<string, string>;
}) {
  const setTrack = useAudioStore((s) => s.setCurrentTrack);

  useEffect(() => {
    // This effect is to ensure that the AudioPlayer works correctly on mount
    const newQueue: Track[] = [
      {
        title: "Ozeria Voice Sample",
        url: "/assets/ozeria-voice-sample.m4a",
        duration: 15,
      },
    ];

    // Subscribe to changes (returns unsubscribe function)
    const unsubscribe = useAudioStore.subscribe(
      (s) => s.isPlaying,
      (isPlaying) => console.log("Playing:", isPlaying)
    );

    setTrack(newQueue[0]);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {/* (DESKTOP) Basic Info Section in a highlighted box */}
      <div className="border p-3 rounded gap-4 mb-6 w-full hidden md:flex">
        <div className="flex-1 flex flex-col gap-3">
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Größe & Gewicht </sub>
            {aussehenInfoSection.Größe}, {aussehenInfoSection.Gewicht}
          </p>
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Frisur </sub>
            {aussehenInfoSection.Frisur}
          </p>
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Augenfarbe </sub>
            {aussehenInfoSection.Augenfarbe}
          </p>
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Versteckte Merkmale </sub>
            {aussehenInfoSection["Versteckte Merkmale"]}
          </p>
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Auffällige Merkmale </sub>
            {aussehenInfoSection["Auffällige Merkmale"] || "~"}
          </p>
        </div>
        <Image
          className="rounded-md w-[300px] h-100 object-bottom ml-4 hidden sm:block"
          src={"/images/characters/ozeria/11.jpg"}
          alt="Character Image"
          width={200}
          height={300}
        />
      </div>

      {/* (MOBILE) Basic Info Section in a highlighted box */}
      <div className="border p-3 rounded gap-4 mb-6 w-full md:hidden">
        <div className="flex-1 flex gap-3 w-full">
          <div className="flex flex-col gap-3 w-1/2">
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Größe & Gewicht </sub>
              {aussehenInfoSection.Größe}, {aussehenInfoSection.Gewicht}
            </p>
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Frisur </sub>
              {aussehenInfoSection.Frisur}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-1/2 ml-auto">
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Augenfarbe </sub>
              {aussehenInfoSection.Augenfarbe}
            </p>
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Versteckte Merkmale </sub>
              {aussehenInfoSection["Versteckte Merkmale"]}
            </p>
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Auffällige Merkmale </sub>
              {aussehenInfoSection["Auffällige Merkmale"] || "~"}
            </p>
          </div>
        </div>
        <Image
          className="rounded-md h-80 block ml-auto mr-auto mt-4"
          src={"/images/characters/ozeria/11.jpg"}
          alt="Character Image"
          width={200}
          height={300}
        />
      </div>
    </div>
  );
}
