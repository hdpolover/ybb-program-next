'use client';

import { useCallback, useEffect, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { createPortal } from 'react-dom';

// Minimum size buat foto profil (200x200px)
const MIN_CROP_SIZE = 200;
// Output size buat cropped image (200x200px - cukup besar buat display dan cepat processing)
const OUTPUT_SIZE = 200;
// JPEG quality (80% - balance antara quality dan file size)
const JPEG_QUALITY = 0.8;

type ImageCropperModalProps = {
  imageFile: File;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
};

export default function ImageCropperModal({
  imageFile,
  onConfirm,
  onCancel,
}: ImageCropperModalProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load image saat component mount
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
      }
    };
    reader.readAsDataURL(imageFile);

    // Cleanup blob URL saat unmount
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageFile]);

  // Handle keyboard (ESC buat cancel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  // Crop gambar dan convert ke File
  const handleCrop = useCallback(async () => {
    if (!croppedArea || !imageSrc) return;

    setIsProcessing(true);

    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedArea);
      if (croppedImageBlob) {
        // Convert Blob ke File
        const croppedFile = new File([croppedImageBlob], imageFile.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        onConfirm(croppedFile);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc, croppedArea, imageFile, onConfirm]);

  // Helper function buat crop gambar menggunakan canvas
  const getCroppedImg = async (
    imageSrc: string,
    croppedArea: Area
  ): Promise<Blob | null> => {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Set canvas size ke output size (400x400)
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    // Draw cropped image ke canvas
    ctx.drawImage(
      image,
      croppedArea.x,
      croppedArea.y,
      croppedArea.width,
      croppedArea.height,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE
    );

    // Convert canvas ke blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', JPEG_QUALITY);
    });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Crop profile photo"
    >
      <div className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl sm:h-auto sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Crop Profile Photo</h2>
          <button
            type="button"
            onClick={onCancel}
            className="focus:ring-primary/40 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-slate-100 sm:min-h-[400px]">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // 1:1 aspect ratio (square)
              minZoom={0.5}
              maxZoom={3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => setCroppedArea(croppedAreaPixels)}
              cropShape="round" // Round crop area buat foto profil
              showGrid={false}
              style={{
                containerStyle: {
                  width: '100%',
                  height: '100%',
                },
              }}
            />
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-4 border-t border-slate-200 px-5 py-3 bg-slate-50">
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
            className="focus:ring-primary/40 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom out"
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${((zoom - 0.5) / 2.5) * 100}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
            className="focus:ring-primary/40 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom in"
            disabled={zoom >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCrop}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing...
              </>
            ) : (
              'Save & Upload'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
