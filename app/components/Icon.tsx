type IconProps = {
  src?: string;
  alt: string;
};

export default function Icon({ src, alt }: IconProps) {
  if (typeof src !== "string") {
    return <div className="w-6 h-6 rounded-full bg-gray-100" />;
  }

  return <img className="w-6 h-6 rounded-full object-cover" src={src} alt={alt} decoding="async" />;
}
