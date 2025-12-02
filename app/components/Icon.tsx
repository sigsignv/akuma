type IconProps = {
  src?: string;
  alt: string;
};

export default function Icon({ src, alt }: IconProps) {
  return typeof src !== "string" ? (
    <div className="w-6 h-6 rounded-full bg-gray-100" />
  ) : (
    <img
      className="w-6 h-6 rounded-full object-cover"
      src={src}
      alt={alt}
      decoding="async"
    />
  );
}
