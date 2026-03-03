"use client";

import { useEffect, useState } from "react";
import { useCreatePromotion, useUpdatePromotion } from "../hooks/usePromotions";
import { useManageEvents } from "@/features/manageEvents/hooks/useManageEvents";
import { Promotion } from "../types/promotions.types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  promotion: Promotion | null;
  organizerId: string;
}

const PromotionFormModal = ({
  isOpen,
  onClose,
  promotion,
  organizerId,
}: Props) => {
  const [discountType, setDiscountType] = useState<"percentage" | "amount">(
    "percentage",
  );

  const { events: eventsResponse = [], isLoading: isLoadingEvents } =
    useManageEvents({ organizerId, limit: 100 });
  const events = eventsResponse;

  const { mutateAsync: createPromo, isPending: isCreating } =
    useCreatePromotion();
  const { mutateAsync: updatePromo, isPending: isUpdating } =
    useUpdatePromotion();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountPercentage: "",
    discountAmount: "",
    maxUsage: "",
    startDate: "",
    endDate: "",
    eventId: "",
  });

  useEffect(() => {
    if (promotion && isOpen) {
      setFormData({
        name: promotion.name,
        code: promotion.code,
        discountPercentage: promotion.discountPercentage?.toString() || "",
        discountAmount: promotion.discountAmount?.toString() || "",
        maxUsage: promotion.maxUsage?.toString() || "",
        startDate: new Date(promotion.startDate).toISOString().split("T")[0],
        endDate: new Date(promotion.endDate).toISOString().split("T")[0],
        eventId: promotion.events?.[0]?.eventId || "",
      });
      setDiscountType(promotion.discountPercentage ? "percentage" : "amount");
    } else if (isOpen) {
      setFormData({
        name: "",
        code: "",
        discountPercentage: "",
        discountAmount: "",
        maxUsage: "",
        startDate: "",
        endDate: "",
        eventId: "",
      });
    }
  }, [promotion, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      name: formData.name,
      code: formData.code.toUpperCase(),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    if (discountType === "percentage") {
      payload.discountPercentage = Number(formData.discountPercentage);
      payload.discountAmount = null;
    } else {
      payload.discountAmount = Number(formData.discountAmount);
      payload.discountPercentage = null;
    }

    if (formData.maxUsage) {
      payload.maxUsage = Number(formData.maxUsage);
    } else {
      payload.maxUsage = null;
    }

    try {
      if (promotion) {
        await updatePromo({ id: promotion.id, data: payload });
      } else {
        payload.organizerId = organizerId;
        payload.events = {
          create: [{ eventId: formData.eventId }],
        };
        await createPromo(payload);
      }
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 1, p: 1 },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div" fontWeight="bold">
          {promotion ? "Edit Promotion" : "Create Promotion"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <XMarkIcon className="w-5 h-5" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Promotion Name"
            required
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Summer Sale 2026"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />

          <TextField
            label="Status Code"
            required
            fullWidth
            disabled={!!promotion}
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value.toUpperCase() })
            }
            placeholder="e.g. SUMMER50"
            helperText="Must be unique. Code cannot be changed once created."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Discount Type
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={discountType}
              exclusive
              onChange={(_, newValue) => {
                if (newValue !== null) setDiscountType(newValue);
              }}
              fullWidth
            >
              <ToggleButton value="percentage">Percentage</ToggleButton>
              <ToggleButton value="amount">Fixed Amount</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {discountType === "percentage" ? (
            <TextField
              label="Discount Percentage (%)"
              type="number"
              required
              fullWidth
              slotProps={{ input: { inputProps: { min: 1, max: 100 } } }}
              value={formData.discountPercentage}
              onChange={(e) =>
                setFormData({ ...formData, discountPercentage: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          ) : (
            <TextField
              label="Discount Amount (Rp)"
              type="number"
              required
              fullWidth
              slotProps={{ input: { inputProps: { min: 0 } } }}
              value={formData.discountAmount}
              onChange={(e) =>
                setFormData({ ...formData, discountAmount: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          )}

          {!promotion && (
            <FormControl fullWidth required>
              <InputLabel id="event-select-label">Applicable Event</InputLabel>
              <Select
                labelId="event-select-label"
                value={formData.eventId}
                label="Applicable Event"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    eventId: e.target.value as string,
                  })
                }
              >
                {events.map((ev: any) => (
                  <MenuItem key={ev.id} value={ev.id}>
                    {ev.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
            <TextField
              label="End Date"
              type="date"
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          <TextField
            label="Max Usage Limit"
            type="number"
            fullWidth
            slotProps={{ input: { inputProps: { min: 1 } } }}
            value={formData.maxUsage}
            onChange={(e) =>
              setFormData({ ...formData, maxUsage: e.target.value })
            }
            helperText="Leave blank for unlimited"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isCreating || isUpdating}
            sx={{
              bgcolor: "#ee2b8c",
              "&:hover": { bgcolor: "#d42279" },
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            {isCreating || isUpdating ? "Saving..." : "Save Promotion"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PromotionFormModal;
