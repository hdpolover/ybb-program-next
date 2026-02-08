import Image, { ImageProps } from 'next/image';

/**
 * Optimized Image Component with smart defaults
 * 
 * Automatically applies:
 * - Lazy loading for below-the-fold images
 * - Priority loading for above-the-fold images
 * - Appropriate sizes attribute based on layout
 * - Quality optimization
 */

type OptimizedImageType = 'hero' | 'banner' | 'logo' | 'avatar' | 'gallery' | 'thumbnail' | 'sponsor' | 'content';

interface OptimizedImageProps extends Omit<ImageProps, 'loading' | 'priority' | 'quality' | 'sizes'> {
  type?: OptimizedImageType;
  customSizes?: string;
}

const IMAGE_CONFIGS: Record<OptimizedImageType, {
  priority: boolean;
  quality: number;
  sizes: string;
}> = {
  hero: {
    priority: true,
    quality: 85,
    sizes: '100vw',
  },
  banner: {
    priority: true,
    quality: 85,
    sizes: '100vw',
  },
  logo: {
    priority: true,
    quality: 90,
    sizes: '(max-width: 768px) 150px, 200px',
  },
  avatar: {
    priority: false,
    quality: 85,
    sizes: '(max-width: 768px) 80px, 120px',
  },
  gallery: {
    priority: false,
    quality: 80,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  },
  thumbnail: {
    priority: false,
    quality: 75,
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  },
  sponsor: {
    priority: false,
    quality: 90,
    sizes: '(max-width: 640px) 80px, 120px',
  },
  content: {
    priority: false,
    quality: 80,
    sizes: '(max-width: 768px) 100vw, 50vw',
  },
};

export default function OptimizedImage({
  type = 'content',
  customSizes,
  alt,
  ...props
}: OptimizedImageProps) {
  const config = IMAGE_CONFIGS[type];

  return (
    <Image
      {...props}
      alt={alt}
      priority={config.priority}
      quality={config.quality}
      sizes={customSizes || config.sizes}
      loading={config.priority ? undefined : 'lazy'}
    />
  );
}

// Convenience exports for common use cases
export function HeroImage(props: Omit<OptimizedImageProps, 'type'>) {
  return <OptimizedImage {...props} type="hero" />;
}

export function LogoImage(props: Omit<OptimizedImageProps, 'type'>) {
  return <OptimizedImage {...props} type="logo" />;
}

export function GalleryImage(props: Omit<OptimizedImageProps, 'type'>) {
  return <OptimizedImage {...props} type="gallery" />;
}

export function AvatarImage(props: Omit<OptimizedImageProps, 'type'>) {
  return <OptimizedImage {...props} type="avatar" />;
}

export function SponsorImage(props: Omit<OptimizedImageProps, 'type'>) {
  return <OptimizedImage {...props} type="sponsor" />;
}
