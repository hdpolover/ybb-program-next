'use client';

import { useState } from 'react';
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
  // Track which src has errored so we can fall back to fallbackSrc without an effect.
  // When resolvedSrc changes (new prop), the errored src no longer matches so we
  // automatically retry the new src instead of staying on the fallback.
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);
  const imageSrc = erroredSrc === resolvedSrc ? fallbackSrc : resolvedSrc;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => {
        if (resolvedSrc !== fallbackSrc) {
          setErroredSrc(resolvedSrc);
        }
      }}
    />
  );
}
