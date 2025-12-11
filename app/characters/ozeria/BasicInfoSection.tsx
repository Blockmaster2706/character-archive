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

export default function BasicInfoSection({
  subSectionClassName,
  nameSection,
  basicInfoSection,
}: {
  subSectionClassName: string;
  nameSection: string;
  basicInfoSection: Record<string, string>;
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
            <sub className={subSectionClassName}>Name</sub>
            {nameSection}
          </p>
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Spitznamen </sub>
            {basicInfoSection.Spitzname}
          </p>
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Geschlecht </sub>
            {basicInfoSection.Geschlecht}
          </p>
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Nationalität </sub>
            {basicInfoSection.Nationalität}
          </p>
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Alter & Geburtstag </sub>
            {basicInfoSection.Alter}, {basicInfoSection.Geburtstag}
          </p>
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Sektor </sub>
            {basicInfoSection.Sektor}
          </p>
        </div>
        <div className="sm:w-[50%]">
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Stimme </sub>
            {basicInfoSection.Stimme.replace("{BUTTON}", "")}
          </p>
          <AudioPlayer className="mt-4 bg-purple-950/50 rounded-md p-2">
            <AudioPlayerControlBar>
              <AudioPlayerControlGroup>
                <AudioPlayerPlay />
                <AudioPlayerSeekBar />
                <AudioPlayerTimeDisplay />
                <AudioPlayerVolume />
              </AudioPlayerControlGroup>
            </AudioPlayerControlBar>
          </AudioPlayer>
        </div>
        <Image
          className="rounded-md w-[210px] h-80 object-cover ml-4 hidden sm:block"
          src={"/images/characters/ozeria/1.jpg"}
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
              <sub className={subSectionClassName}>Name</sub>
              {nameSection}
            </p>
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Spitznamen </sub>
              {basicInfoSection.Spitzname}
            </p>
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Geschlecht </sub>
              {basicInfoSection.Geschlecht}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-1/2 ml-auto">
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Nationalität </sub>
              {basicInfoSection.Nationalität}
            </p>
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Alter & Geburtstag </sub>
              {basicInfoSection.Alter}, {basicInfoSection.Geburtstag}
            </p>
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Sektor </sub>
              {basicInfoSection.Sektor}
            </p>
          </div>
        </div>
        <div className="w-full mt-4">
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Stimme </sub>
            {basicInfoSection.Stimme.replace("{BUTTON}", "")}
          </p>
          <AudioPlayer className="mt-4 bg-purple-950/50 rounded-md p-2">
            <AudioPlayerControlBar>
              <AudioPlayerControlGroup>
                <AudioPlayerPlay />
                <AudioPlayerSeekBar />
                <AudioPlayerTimeDisplay />
                <AudioPlayerVolume />
              </AudioPlayerControlGroup>
            </AudioPlayerControlBar>
          </AudioPlayer>
        </div>
        <Image
          className="rounded-md h-80 block ml-auto mr-auto mt-4"
          src={"/images/characters/ozeria/1.jpg"}
          alt="Character Image"
          width={200}
          height={300}
        />
      </div>
    </div>
  );
}
