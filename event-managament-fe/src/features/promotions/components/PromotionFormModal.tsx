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
import { useFormik } from "formik";
import { promotionValidationSchema } from "../schemas/promotions.schemas";

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
  const { events: eventsResponse = [], isLoading: isLoadingEvents } =
    useManageEvents({ organizerId, limit: 100 });
  const events = eventsResponse;

  const { mutateAsync: createPromo, isPending: isCreating } =
    useCreatePromotion();
  const { mutateAsync: updatePromo, isPending: isUpdating } =
    useUpdatePromotion();

  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      discountType: "percentage" as "percentage" | "amount",
      discountPercentage: "",
      discountAmount: "",
      maxUsage: "",
      startDate: "",
      endDate: "",
      eventId: "",
    },
    validationSchema: promotionValidationSchema,
    validateOnMount: false,
    validateOnBlur: true,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const payload: any = {
        name: values.name,
        code: values.code.toUpperCase(),
        // startDate: new Date(values.startDate).toISOString(),
        // endDate: new Date(values.endDate).toISOString(),
        startDate: new Date(`${values.startDate}T00:00:00+07:00`).toISOString(),
        endDate: new Date(`${values.endDate}T23:59:59+07:00`).toISOString(),
      };

      if (values.discountType === "percentage") {
        payload.discountPercentage = Number(values.discountPercentage);
        payload.discountAmount = null;
      } else {
        payload.discountAmount = Number(values.discountAmount);
        payload.discountPercentage = null;
      }

      if (values.maxUsage) {
        payload.maxUsage = Number(values.maxUsage);
      } else {
        payload.maxUsage = null;
      }

      try {
        if (promotion) {
          await updatePromo({ id: promotion.id, data: payload });
        } else {
          payload.organizerId = organizerId;
          payload.events = {
            create: [{ eventId: values.eventId }],
          };
          await createPromo(payload);
        }
        onClose();
      } catch (err: any) {
        alert(err?.response?.data?.message || "An error occurred");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      formik.resetForm();
      if (promotion) {
        formik.setValues({
          name: promotion.name,
          code: promotion.code,
          discountType: promotion.discountPercentage ? "percentage" : "amount",
          discountPercentage: promotion.discountPercentage?.toString() || "",
          discountAmount: promotion.discountAmount?.toString() || "",
          maxUsage: promotion.maxUsage?.toString() || "",
          // startDate: new Date(promotion.startDate).toISOString().split("T")[0],
          // endDate: new Date(promotion.endDate).toISOString().split("T")[0],
          startDate: new Date(
            new Date(promotion.startDate).getTime() + 7 * 60 * 60 * 1000,
          )
            .toISOString()
            .split("T")[0],
          endDate: new Date(
            new Date(promotion.endDate).getTime() + 7 * 60 * 60 * 1000,
          )
            .toISOString()
            .split("T")[0],
          eventId: promotion.events?.[0]?.eventId || "",
        });
      }
    }
  }, [promotion, isOpen]);

  if (!isOpen) return null;

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

      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            name="name"
            label="Promotion Name"
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            placeholder="e.g. Summer Sale 2026"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />

          <TextField
            name="code"
            label="Status Code"
            fullWidth
            disabled={!!promotion}
            value={formik.values.code}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={
              (formik.touched.code && formik.errors.code) ||
              (!promotion &&
                "Must be unique. Code cannot be changed once created.")
            }
            placeholder="e.g. SUMMER50"
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
              value={formik.values.discountType}
              exclusive
              onChange={(_, newValue) => {
                if (newValue !== null) {
                  formik.setFieldValue("discountType", newValue);
                  formik.setFieldTouched("discountPercentage", false);
                  formik.setFieldTouched("discountAmount", false);
                }
              }}
              fullWidth
            >
              <ToggleButton value="percentage">Percentage</ToggleButton>
              <ToggleButton value="amount">Fixed Amount</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {formik.values.discountType === "percentage" ? (
            <TextField
              name="discountPercentage"
              label="Discount Percentage (%)"
              type="number"
              fullWidth
              slotProps={{ input: { inputProps: { min: 1, max: 100 } } }}
              value={formik.values.discountPercentage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.discountPercentage &&
                Boolean(formik.errors.discountPercentage)
              }
              helperText={
                formik.touched.discountPercentage &&
                formik.errors.discountPercentage
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          ) : (
            <TextField
              name="discountAmount"
              label="Discount Amount (Rp)"
              type="number"
              fullWidth
              slotProps={{ input: { inputProps: { min: 0 } } }}
              value={formik.values.discountAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.discountAmount &&
                Boolean(formik.errors.discountAmount)
              }
              helperText={
                formik.touched.discountAmount && formik.errors.discountAmount
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          )}

          {!promotion && (
            <FormControl
              fullWidth
              error={formik.touched.eventId && Boolean(formik.errors.eventId)}
            >
              <InputLabel id="event-select-label">Applicable Event</InputLabel>
              <Select
                name="eventId"
                labelId="event-select-label"
                value={formik.values.eventId}
                label="Applicable Event"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {events.map((ev: any) => (
                  <MenuItem key={ev.id} value={ev.id}>
                    {ev.title}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.eventId && formik.errors.eventId && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 2 }}
                >
                  {String(formik.errors.eventId)}
                </Typography>
              )}
            </FormControl>
          )}

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.startDate && Boolean(formik.errors.startDate)
              }
              helperText={
                formik.touched.startDate && (formik.errors.startDate as string)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={
                formik.touched.endDate && (formik.errors.endDate as string)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          <TextField
            name="maxUsage"
            label="Max Usage Limit"
            type="number"
            fullWidth
            slotProps={{ input: { inputProps: { min: 1 } } }}
            value={formik.values.maxUsage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.maxUsage && Boolean(formik.errors.maxUsage)}
            helperText={
              (formik.touched.maxUsage && formik.errors.maxUsage) ||
              "Leave blank for unlimited"
            }
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
            disabled={formik.isSubmitting || isCreating || isUpdating}
            sx={{
              bgcolor: "#ee2b8c",
              "&:hover": { bgcolor: "#d42279" },
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            {formik.isSubmitting || isCreating || isUpdating
              ? "Saving..."
              : "Save Promotion"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PromotionFormModal;
