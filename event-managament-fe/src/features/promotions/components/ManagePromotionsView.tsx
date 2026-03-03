"use client";

import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useGetPromotions, useDeletePromotion } from "../hooks/usePromotions";
import { useState } from "react";
import {
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import PromotionFormModal from "./PromotionFormModal";
import { Promotion } from "../types/promotions.types";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";

const ManagePromotionsView = () => {
  const { user } = useStoreLogin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );

  const organizerId = user?.organizer?.id ?? "";

  const {
    data: promotionsResponse,
    isLoading,
    error,
  } = useGetPromotions({
    organizerId,
    limit: 50,
  });

  const { mutate: deletePromo, isPending: isDeleting } = useDeletePromotion();

  const promotions = promotionsResponse?.data || [];

  const handleCreate = () => {
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromotion(promo);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this promotion?")) {
      deletePromo(id);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 2, md: 4 },
        bgcolor: "background.default",
        overflowY: "auto",
      }}
    >
      <Box sx={{ maxWidth: "lg", mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight="900"
              gutterBottom
              sx={{ fontFamily: "inherit" }}
            >
              Promotions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your discount codes and vouchers
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleCreate}
            startIcon={<PlusIcon className="w-5 h-5" />}
            sx={{
              bgcolor: "#ee2b8c",
              "&:hover": { bgcolor: "#d42279" },
              fontWeight: "bold",
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              py: 1,
            }}
          >
            Create Promotion
          </Button>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Failed to load promotions. Please try again later.
          </Alert>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#ee2b8c" }} />
          </Box>
        ) : promotions.length === 0 ? (
          <Box
            sx={{
              py: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                color: "text.secondary",
              }}
            >
              <TagIcon className="w-8 h-8" />
            </Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              No promotions yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 350, mb: 3 }}
            >
              Create your first discount code to help boost your event sales and
              attract more attendees.
            </Typography>
            <Button
              onClick={handleCreate}
              sx={{
                color: "#ee2b8c",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              + Create your first promo
            </Button>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="promotions table">
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    Name & Code
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    Event
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    Discount
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    Usage
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    Valid Dates
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {promotions.map((promo) => (
                  <TableRow
                    key={promo.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { bgcolor: "action.hover" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {promo.name}
                      </Typography>
                      <Chip
                        label={promo.code}
                        size="small"
                        sx={{
                          mt: 0.5,
                          bgcolor: "rgba(238, 43, 140, 0.1)",
                          color: "#ee2b8c",
                          fontWeight: "bold",
                          fontFamily: "monospace",
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        {promo.events && promo.events.length > 0
                          ? promo.events[0].event?.name ||
                            promo.events[0].event?.title ||
                            "All Events"
                          : "All Events"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {promo.discountPercentage ? (
                        <Typography
                          variant="body2"
                          fontWeight="500"
                          color="success.main"
                        >
                          {Number(promo.discountPercentage)}% OFF
                        </Typography>
                      ) : (
                        <Typography
                          variant="body2"
                          fontWeight="500"
                          color="success.main"
                        >
                          Rp{" "}
                          {Number(promo.discountAmount).toLocaleString("id-ID")}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {promo._count?.transactions || 0} /{" "}
                        {promo.maxUsage ? promo.maxUsage : "∞"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem", lineHeight: 1.6 }}
                      >
                        <Box component="span" display="block">
                          Start:{" "}
                          {format(new Date(promo.startDate), "MMM d, yyyy")}
                        </Box>
                        <Box component="span" display="block">
                          End: {format(new Date(promo.endDate), "MMM d, yyyy")}
                        </Box>
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEdit(promo)}
                        size="small"
                        color="primary"
                        sx={{
                          mr: 1,
                          "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
                        }}
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(promo.id)}
                        disabled={isDeleting}
                        size="small"
                        color="error"
                        sx={{
                          "&:hover": { bgcolor: "rgba(211, 47, 47, 0.04)" },
                        }}
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <PromotionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promotion={editingPromotion}
        organizerId={organizerId}
      />
    </Box>
  );
};

export default ManagePromotionsView;
