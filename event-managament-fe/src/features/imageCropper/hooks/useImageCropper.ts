
"use client";

import { useState, useCallback } from "react";
import { Area } from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

interface UseImageCropperProps {
  imageSrc: string | null;
  onCropComplete: (croppedFile: File) => void;
  onClose: () => void;
}

export const useImageCropper = ({ imageSrc, onCropComplete, onClose }: UseImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        onCropComplete(croppedFile);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to crop image.");
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return {
    crop,
    zoom,
    setZoom,
    isProcessing,
    onCropChange,
    onZoomChange,
    handleCropComplete,
    handleSave,
  };
};
