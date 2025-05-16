import { useState } from "react";

export function Image({
  src,
  alt,
  width = 100,
  height = 100,
  className = "",
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{ width }}
      className={`relative overflow-hidden ${className} h-full`} // Ensure height is full
    >
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-300 object-cover ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
