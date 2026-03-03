"use client";

import { manageEventsRepository } from "@/features/manageEvents/repositories/manageEventsRepository";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface ICreateTicketTierFormProps {
  eventId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateTicketTierForm: React.FC<ICreateTicketTierFormProps> = ({
  eventId,
  onCancel,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quota, setQuota] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name || !price || !quota) {
      setError("Name, Price, and Quota are required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await manageEventsRepository.createTicketTier(eventId, {
        name,
        price: Number(price),
        quota: Number(quota),
        description,
      });
      onSuccess();
    } catch (error: any) {
      console.error("Failed to create ticket tier:", error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create ticket tier.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 1,
        border: "2px solid",
        borderColor: "#ee2b8c",
        bgcolor: "rgba(238, 43, 140, 0.02)",
        mb: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
        Create New Ticket Tier
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "5fr 3fr 4fr" },
          gap: 2,
          mb: 2,
        }}
      >
        {/* Ticket Name */}
        <Box>
          <Typography
            variant="overline"
            fontWeight="bold"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Ticket Name *
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. VIP Pass"
            variant="outlined"
            size="small"
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 0.8,
                bgcolor: "white",
              },
            }}
          />
        </Box>

        {/* Quota */}
        <Box>
          <Typography
            variant="overline"
            fontWeight="bold"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Quota
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            placeholder="0"
            variant="outlined"
            size="small"
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 0.8,
                bgcolor: "white",
              },
            }}
          />
        </Box>

        {/* Price */}
        <Box>
          <Typography
            variant="overline"
            fontWeight="bold"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Price (IDR) *
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            variant="outlined"
            size="small"
            disabled={isLoading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">Rp</InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 0.8,
                bgcolor: "white",
              },
            }}
          />
        </Box>
      </Box>

      {/* Description */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="overline"
          fontWeight="bold"
          color="text.secondary"
          sx={{ display: "block", mb: 1 }}
        >
          Description (Optional)
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide details about what this ticket includes..."
          variant="outlined"
          size="small"
          disabled={isLoading}
          sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "white",
              },
            }}
        />
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          onClick={onCancel}
          disabled={isLoading}
          sx={{ color: "text.secondary", fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            bgcolor: "black",
            color: "white",
            borderRadius: 2,
            px: 4,
            fontWeight: 700,
            "&:hover": { bgcolor: "#c2185b" },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Save Tier"
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateTicketTierForm;
