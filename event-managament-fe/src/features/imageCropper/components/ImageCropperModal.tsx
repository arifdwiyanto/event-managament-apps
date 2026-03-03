import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slider, Typography, Box } from "@mui/material";
import {ImageCropperModalProps} from "../types"


import { useImageCropper } from "../hooks/useImageCropper";

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  open,
  imageSrc,
  onClose,
  onCropComplete,
  title = "Crop Image",
  aspectRatio = 1,
}) => {
  const {
    crop,
    zoom,
    setZoom,
    isProcessing,
    onCropChange,
    onZoomChange,
    handleCropComplete,
    handleSave,
  } = useImageCropper({ imageSrc, onCropComplete, onClose });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers sx={{ p: 0, position: "relative", height: 400, bgcolor: "#333" }}>
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onCropComplete={handleCropComplete}
            onZoomChange={onZoomChange}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ flexDirection: "column", px: 3, py: 2, alignItems: "stretch", gap: 2 }}>
        <Box sx={{ width: "100%", px: 2 }}>
          <Typography gutterBottom variant="caption">
            Zoom
          </Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, zoom) => setZoom(Number(zoom))}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, width: "100%" }}>
          <Button onClick={onClose} disabled={isProcessing} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isProcessing || !imageSrc} variant="contained" color="primary">
            {isProcessing ? "Processing..." : "Crop & Save"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
