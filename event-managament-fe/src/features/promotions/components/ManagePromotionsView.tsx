"use client";

import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useGetPromotions, useDeletePromotion } from "../hooks/usePromotions";
import { useState } from "react";
import PromotionFormModal from "./PromotionFormModal";
import { Promotion } from "../types/promotions.types";
import {
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import PromotionsHeader from "./PromotionsHeader";
import EmptyPromotions from "./EmptyPromotions";
import PromotionsTable from "./PromotionsTable";
import PromotionCard from "./PromotionCard";
import PromotionsPagination from "./PromotionsPagination";

const ManagePromotionsView = () => {
  const { user } = useStoreLogin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  const organizerId = user?.organizer?.id ?? "";

  const {
    data: promotionsResponse,
    isLoading,
    error,
  } = useGetPromotions({
    organizerId,
    page,
    limit,
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
        <PromotionsHeader onCreateClick={handleCreate} />

        {error ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Failed to load promotions. Please try again later.
          </Alert>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#ee2b8c" }} />
          </Box>
        ) : promotions.length === 0 ? (
          <EmptyPromotions onCreateClick={handleCreate} />
        ) : (
          <Box>
            {/* Desktop View - Table */}
            <PromotionsTable
              promotions={promotions}
              page={page}
              limit={limit}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />

            {/* Mobile View - Cards */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "column",
                gap: 2,
              }}
            >
              {promotions.map((promo, index) => (
                <PromotionCard
                  key={promo.id}
                  promo={promo}
                  index={index}
                  page={page}
                  limit={limit}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              ))}
            </Box>

            {/* Pagination Controls */}
            {promotionsResponse?.meta && (
              <PromotionsPagination
                total={promotionsResponse.meta.total}
                page={page}
                limit={limit}
                totalPages={promotionsResponse.meta.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </Box>
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
