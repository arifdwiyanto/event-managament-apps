import { PhotoIcon } from "@heroicons/react/24/outline";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { FormikProps } from "formik";

interface ICreateEventMediaProps {
  formik: FormikProps<any>;
}

const CreateEventMedia: React.FC<ICreateEventMediaProps> = ({ formik }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        formik.setFieldError("imageFile", "File size must not exceed 5MB");
        return;
      }
      // Validate file type
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        formik.setFieldError(
          "imageFile",
          "Only JPG, PNG, and WebP formats are allowed"
        );
        return;
      }
      formik.setFieldValue("imageFile", file);
      formik.setFieldError("imageFile", "");
    }
  };

  useEffect(() => {
    if (formik.values.imageFile) {
      const url = URL.createObjectURL(formik.values.imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [formik.values.imageFile]);
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <PhotoIcon className="w-6 h-6 text-[#ee2b8c]" />
        <Typography variant="h6" fontWeight="bold">
          Media
        </Typography>
      </Box>

      <Box
        onClick={() => fileInputRef.current?.click()}
        sx={{
          width: "100%",
          border: "2px dashed",
          borderColor: formik.errors.imageFile ? "#d32f2f" : "divider",
          borderRadius: 1,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            borderColor: "#ee2b8c",
            bgcolor: "rgba(238, 43, 140, 0.05)",
          },
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp"
          style={{ display: "none" }}
        />

        {formik.values.imageFile && previewUrl ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 256,
                height: 156,
                borderRadius: 1,
                bgcolor: "rgba(238, 43, 140, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                overflow: "hidden",
              }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#ee2b8c"
              gutterBottom
            >
              Image Selected
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="medium"
              gutterBottom
            >
              {formik.values.imageFile.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ textTransform: "uppercase", letterSpacing: 1 }}
            >
              Click to change poster
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                width: 110,
                height: 64,
                borderRadius: 1,
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <PhotoIcon className="w-8 h-8 text-[#ee2b8c]" />
            </Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Upload Event Poster
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="medium"
              gutterBottom
            >
              Drag and drop or click to browse
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ textTransform: "uppercase", letterSpacing: 1 }}
            >
              Recommended: 16:9 ratio, max 5MB (JPG, PNG)
            </Typography>
          </>
        )}
      </Box>
      {formik.errors.imageFile && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 1, display: "block" }}
        >
          {typeof formik.errors.imageFile === "string" ? formik.errors.imageFile : ""}
        </Typography>
      )}
    </Box>
  );
};

export default CreateEventMedia;
