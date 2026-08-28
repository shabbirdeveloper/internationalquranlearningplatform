import Image from "next/image";

export function ManagedContentImage({ src, alt, sizes, className, priority = false }: { src: string; alt: string; sizes: string; className?: string; priority?: boolean }) {
  if (src.startsWith("/")) {
    return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={className} />;
  }

  return (
    // Remote images are managed by academy staff and can come from different approved hosts.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} className={`absolute inset-0 h-full w-full ${className ?? ""}`} />
  );
}

