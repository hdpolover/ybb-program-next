'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type ProgramDetailImageProps = {
  src?: string | null;
  fallbackSrc: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export default function ProgramDetailImage({
  src,
  fallbackSrc,
  alt,
  sizes,
  className,
  priority = false,
}: ProgramDetailImageProps) {
  const resolvedSrc = src?.trim() || fallbackSrc;
  const [imageSrc, setImageSrc] = useState(resolvedSrc);

  useEffect(() => {
    setImageSrc(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => {
        if (imageSrc !== fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
      }}
    />
  );
}
