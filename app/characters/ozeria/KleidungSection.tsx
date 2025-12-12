import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function KleidungSection({
  subSectionClassName,
  kleidungSection,
}: {
  subSectionClassName: string;
  kleidungSection: Record<string, string>;
}) {
  return (
    <div>
      {/* (DESKTOP) Basic Info Section in a highlighted box */}
      <div className="border p-3 rounded gap-4 mb-6 w-full hidden md:flex">
        <div className="flex-1 flex flex-col gap-3">
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Standard Outfit </sub>
            {kleidungSection["Standard Outfit"]}
          </p>
          <p className="flex flex-col">
            <sub className={subSectionClassName}>Accessoires </sub>
            {kleidungSection["Accessoires"]}
          </p>
        </div>
        <Carousel
          className="rounded-md w-[300px] h-100 object-bottom ml-4 hidden sm:block"
          opts={{ loop: true, dragFree: true }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
            }),
          ]}
        >
          <CarouselContent>
            <CarouselItem>
              <Image
                className="rounded-md w-[300px] h-100 object-bottom hidden sm:block"
                src={"/images/characters/ozeria/Necklace.jpg"}
                alt="Character Image"
                width={200}
                height={300}
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                className="rounded-md w-[300px] h-100 object-bottom hidden sm:block"
                src={"/images/characters/ozeria/8.jpg"}
                alt="Character Image"
                width={200}
                height={300}
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                className="rounded-md w-[300px] h-100 object-bottom hidden sm:block"
                src={"/images/characters/ozeria/12.jpg"}
                alt="Character Image"
                width={200}
                height={300}
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      {/* (MOBILE) Basic Info Section in a highlighted box */}
      <div className="border p-3 rounded gap-4 mb-6 w-full md:hidden">
        <div className="flex-1 flex gap-3 w-full">
          <div className="flex flex-col gap-3 w-full">
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Standard Outfit </sub>
              {kleidungSection["Standard Outfit"]}
            </p>
            <p className="flex flex-col">
              <sub className={subSectionClassName}>Accessoires </sub>
              {kleidungSection["Accessoires"]}
            </p>
          </div>
        </div>
        <Carousel
          className="rounded-md h-80 block ml-auto mr-auto mt-4"
          opts={{ loop: true, dragFree: true }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
            }),
          ]}
        >
          <CarouselContent>
            <CarouselItem>
              <Image
                className="rounded-md h-80 block ml-auto mr-auto mt-4"
                src={"/images/characters/ozeria/Necklace.jpg"}
                alt="Character Image"
                width={200}
                height={300}
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                className="rounded-md h-80 block ml-auto mr-auto mt-4"
                src={"/images/characters/ozeria/8.jpg"}
                alt="Character Image"
                width={200}
                height={300}
              />
            </CarouselItem>
            <CarouselItem>
              <Image
                className="rounded-md h-80 block ml-auto mr-auto mt-4"
                src={"/images/characters/ozeria/12.jpg"}
                alt="Character Image"
                width={200}
                height={300}
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
