"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import CreateEventBasics from "./createForm/CreateEventBasic";
import CreateEventDateTimeLocation from "./createForm/CreateEventDateTimeLocation";
import CreateEventHeader from "./createForm/CreateEventHeader";
import CreateEventMedia from "./createForm/CreateEventMedia";
import CreateEventTickets, {
  TicketTier,
} from "./createForm/CreateEventTickets";
import { useRouter } from "next/navigation";
import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useManageEventsData } from "../hooks/useManageEventsData";
import { createEventValidationSchema } from "../schemas/createEvent.schemas";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Snackbar,
  Typography,
} from "@mui/material";

const CreateEventView = () => {
  const router = useRouter();
  const { user } = useStoreLogin();
  const {
    categories,
    isCategoriesLoading,
    createEvent,
    isCreating,
    createError,
  } = useManageEventsData();

  const formik = useFormik({
    initialValues: {
      name: "",
      categoryId: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      tickets: [] as TicketTier[],
      imageFile: null as File | null,
    },
    validationSchema: createEventValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      handlePublish(values);
    },
  });

  // Snackbar State
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (!formik.values.categoryId && categories.length > 0) {
      formik.setFieldValue("categoryId", categories[0].id);
    }
  }, [categories, formik.values.categoryId]);

  const handleCancel = () => {
    router.push("/dashboard/events");
  };

  const handleSaveDraft = () => {
    console.log("Draft saved");
  };

  const handlePublish = async (values: typeof formik.values) => {
    // Validate at submit time
    try {
      await createEventValidationSchema.validate(values, { abortEarly: false });
    } catch (error: any) {
      if (error.inner && error.inner.length > 0) {
        const firstError = error.inner[0];
        setSnackbar({
          open: true,
          message: firstError.message,
          severity: "warning",
        });
      }
      return;
    }

    const organizerId = user?.organizer?.id;
    if (!organizerId) {
      setSnackbar({
        open: true,
        message: "Error: Only organizers can create events.",
        severity: "error",
      });
      return;
    }

    try {
      await createEvent(
        {
          organizerId,
          categoryId: values.categoryId,
          name: values.name,
          description: values.description,
          location: values.location,
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
          isPaid: values.tickets.some((t) => Number(t.price) > 0),
          ticketTypes: values.tickets.map((t) => ({
            name: t.name || "Regular",
            price: Number(t.price) || 0,
            quota: Number(t.quantity) || 0,
            description: t.description || undefined,
          })),
        },
        values.imageFile || undefined,
      );

      setSnackbar({
        open: true,
        message: "Event created successfully!",
        severity: "success",
      });
      setTimeout(() => {
        router.push("/dashboard/events");
      }, 1000);
    } catch (error) {
      console.error("Failed to publish event:", error);
    }
  };

  if (isCategoriesLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CreateEventHeader
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
      />
      <Box sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight="900"
            align="center"
            gutterBottom
            sx={{ fontFamily: "var(--font-display)", letterSpacing: "-1px" }}
          >
            Create a New{" "}
            <Box component="span" sx={{ color: "#ee2b8c" }}>
              Event
            </Box>
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            fontWeight="medium"
            sx={{ mb: 6 }}
          >
            Fill in the details below to publish your event to the Hype
            community.
          </Typography>

          {/* Form */}
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 1,
              p: { xs: 3, md: 5 },
              boxShadow: 2,
            }}
          >
            <CreateEventBasics formik={formik} categories={categories} />

            <Divider sx={{ my: 5 }} />

            <CreateEventDateTimeLocation formik={formik} />

            <Divider sx={{ my: 5 }} />

            <CreateEventTickets formik={formik} />

            <Divider sx={{ my: 5 }} />

            <CreateEventMedia formik={formik} />
          </Box>

          {/* Publish Action */}
          <Box
            sx={{
              mt: 6,
              mb: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {createError && (
              <Alert
                severity="error"
                sx={{ width: "100%", mb: 3, borderRadius: 2 }}
              >
                {createError}
              </Alert>
            )}
            <Button
              onClick={() => formik.handleSubmit()}
              disabled={isCreating || !formik.isValid}
              variant="contained"
              fullWidth
              size="large"
              sx={{
                py: 2,
                borderRadius: 1,
                bgcolor: "#ee2b8c",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.125rem",
                textTransform: "none",
                "&:hover": { bgcolor: "#d6197b" },
              }}
            >
              {isCreating ? "Publishing..." : "Publish Event 🚀"}
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="medium"
              sx={{ mt: 2, textAlign: "center" }}
            >
              By publishing, you agree to Hype's Terms of Service for
              Organizers.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateEventView;
