"use client";

import { useEffect, useState } from "react";
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

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [tickets, setTickets] = useState<TicketTier[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);

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
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleCancel = () => {
    router.push("/dashboard/events");
  };

  const handleSaveDraft = () => {
    console.log("Draft saved");
  };

  const handlePublish = async () => {
    if (!name || !categoryId || !startDate || !endDate || !location) {
      setSnackbar({
        open: true,
        message: "Please fill in all required basic details.",
        severity: "warning",
      });

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
          categoryId,
          name,
          description,
          location,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          isPaid: tickets.some((t) => Number(t.price) > 0),
          ticketTypes: tickets.map((t) => ({
            name: t.name || "Regular",
            price: Number(t.price) || 0,
            quota: Number(t.quantity) || 0,
            description: t.description || undefined,
          })),
        },
        imageFile || undefined,
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
            <CreateEventBasics
              name={name}
              setName={setName}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              description={description}
              setDescription={setDescription}
              categories={categories}
            />

            <Divider sx={{ my: 5 }} />

            <CreateEventDateTimeLocation
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              location={location}
              setLocation={setLocation}
            />

            <Divider sx={{ my: 5 }} />

            <CreateEventTickets tickets={tickets} setTickets={setTickets} />

            <Divider sx={{ my: 5 }} />

            <CreateEventMedia
              imageFile={imageFile}
              setImageFile={setImageFile}
            />
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
              onClick={handlePublish}
              disabled={isCreating}
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
