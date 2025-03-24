type IconProps = {
  src: string;
  alt: string;
};

export default function Icon({ src, alt }: IconProps) {
  return (
    <img
      className="w-6 h-6 rounded-full object-contain bg-gray-100"
      src={src}
      alt={alt}
      decoding="async"
    />
  );
}
