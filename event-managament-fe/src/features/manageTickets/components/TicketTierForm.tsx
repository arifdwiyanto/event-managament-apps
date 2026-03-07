"use client";

import { manageEventsRepository } from "@/features/manageEvents/repositories/manageEventsRepository";
import { TicketTierData } from "../types/ticketTierData.types";
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

interface ITicketTierFormProps {
  eventId: string;
  tier?: TicketTierData; // If provided, component operates in Edit mode
  onCancel: () => void;
  onSuccess: () => void;
}

const TicketTierForm: React.FC<ITicketTierFormProps> = ({
  eventId,
  tier,
  onCancel,
  onSuccess,
}) => {
  const isEdit = !!tier;

  const [name, setName] = useState(tier?.name || "");
  const [price, setPrice] = useState(tier?.price?.toString() || "");
  const [quota, setQuota] = useState(tier?.total?.toString() || "");
  const [description, setDescription] = useState(tier?.description || "");

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
      if (isEdit) {
        await manageEventsRepository.updateTicketTier(eventId, tier.id, {
          name,
          price: Number(price),
          quota: Number(quota),
          description,
        });
      } else {
        await manageEventsRepository.createTicketTier(eventId, {
          name,
          price: Number(price),
          quota: Number(quota),
          description,
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error(`Failed to ${isEdit ? "update" : "create"} ticket tier:`, error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          `Failed to ${isEdit ? "update" : "create"} ticket tier.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 3,
        borderRadius: 1,
        border: "2px solid",
        borderColor: isEdit ? "divider" : (theme.palette.mode === "dark" ? "#c2185b" : "#ee2b8c"),
        bgcolor: isEdit ? "background.paper" : (theme.palette.mode === "dark" ? "rgba(238, 43, 140, 0.05)" : "rgba(238, 43, 140, 0.02)"),
        mb: 3,
        mt: isEdit ? 2 : 0,
      })}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
        {isEdit ? `Edit Ticket Tier: ${tier.name}` : "Create New Ticket Tier"}
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
            sx={(theme) => ({
              "& .MuiOutlinedInput-root": {
                borderRadius: 0.8,
                bgcolor: isEdit ? "transparent" : (theme.palette.mode === "dark" ? "background.default" : "white"),
              },
            })}
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
            sx={(theme) => ({
              "& .MuiOutlinedInput-root": {
                borderRadius: 0.8,
                bgcolor: isEdit ? "transparent" : (theme.palette.mode === "dark" ? "background.default" : "white"),
              },
            })}
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
            sx={(theme) => ({
              "& .MuiOutlinedInput-root": {
                borderRadius: 0.8,
                bgcolor: isEdit ? "transparent" : (theme.palette.mode === "dark" ? "background.default" : "white"),
              },
            })}
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
          sx={(theme) => ({
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              bgcolor: isEdit ? "transparent" : (theme.palette.mode === "dark" ? "background.default" : "white"),
            },
          })}
        />
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", sm: "row" }, justifyContent: "flex-end", gap: { xs: 1.5, sm: 2 } }}>
        <Button
          onClick={onCancel}
          disabled={isLoading}
          fullWidth={true}
          sx={{ color: "text.secondary", fontWeight: 600, width: { sm: "auto" } }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          fullWidth={true}
          sx={{
            bgcolor: "#ee2b8c",
            color: "white",
            borderRadius: 2,
            px: { xs: 2, sm: 4 },
            py: { xs: 1.5, sm: 1 },
            fontWeight: 700,
            width: { sm: "auto" },
            "&:hover": { 
              bgcolor: "#d6197b",
              boxShadow: "0 4px 12px rgba(238, 43, 140, 0.2)"
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Save Tier"
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default TicketTierForm;
