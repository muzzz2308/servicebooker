import Image from "next/image";

const tiles = [
  { src: "/marketing/hero-stylist.png", label: "Hair" },
  { src: "/marketing/hero-nails.png", label: "Nails" },
  { src: "/marketing/hero-field.png", label: "Home service" },
  { src: "/marketing/industry-clean.png", label: "Cleaning" },
  { src: "/marketing/portrait-trainer.png", label: "Training" },
  { src: "/marketing/still-tools.png", label: "Studios" },
  { src: "/marketing/waiting-book.png", label: "Waiting rooms" },
  { src: "/marketing/feature-phone.png", label: "On the phone" },
];

export function IndustryMarquee() {
  const loop = [...tiles, ...tiles];

  return (
    <section className="overflow-hidden border-y border-line bg-panel/50 py-6 sm:py-8">
      <p className="mb-4 px-page text-center text-[11px] uppercase tracking-[0.2em] text-mist sm:mb-5 sm:text-xs sm:tracking-[0.28em]">
        Built for the people who show up
      </p>
      <div className="group flex w-max animate-marquee gap-3 px-4 sm:gap-4">
        {loop.map((tile, index) => (
          <figure
            key={`${tile.label}-${index}`}
            className="relative h-28 w-40 shrink-0 overflow-hidden rounded-2xl border border-line sm:h-36 sm:w-52"
          >
            <Image
              src={tile.src}
              alt=""
              fill
              className="object-cover opacity-80 transition duration-700 group-hover:opacity-100 hover:scale-110"
              sizes="(min-width: 640px) 208px, 160px"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/40 to-transparent px-3 py-2 text-xs font-medium sm:py-3">
              {tile.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
