"use client";

import React, { useState } from "react";
import { TicketTierData } from "../types/ticketTierData.types";
import { Box, Button, Stack, Typography, Snackbar, Alert } from "@mui/material";
import { useOrgRole } from "@/hooks/useOrgRole";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import AddIcon from "@mui/icons-material/Add";
import TicketTierCard from "./TicketTierCard";
import TicketTierForm from "./TicketTierForm";

interface ITicketTiersListProps {
  eventId: string;
  tiersData: TicketTierData[];
  onTierAdded: () => void;
}

const TicketTiersList: React.FC<ITicketTiersListProps> = ({
  eventId,
  tiersData,
  onTierAdded,
}) => {
  const role = useOrgRole();
  const isEditable = role === "OWNER" || role === "ADMIN";
  const [isCreating, setIsCreating] = useState(false);
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 2.5, sm: 0 },
          mb: { xs: 3, sm: 4 },
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ConfirmationNumberOutlinedIcon
            sx={(theme) => ({
              color: theme.palette.mode === "dark" ? "#ff4081" : "#ee2b8c",
              fontSize: 28,
            })}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.5px",
            }}
          >
            Ticket Tiers
          </Typography>
        </Box>

        {isEditable && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
            sx={(theme) => ({
              bgcolor: "#ee2b8c",
              color: "white",
              borderRadius: 6,
              px: { xs: 2, sm: 3 },
              py: { xs: 0.75, sm: 1 },
              textTransform: "none",
              fontWeight: 800,
              fontSize: { xs: "0.80rem", sm: "0.875rem" },
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                bgcolor: "#d6197b",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(238, 43, 140, 0.3)",
              },
              transition: "all 0.2s",
            })}
          >
            Add New Tier
          </Button>
        )}
      </Box>

      {/* Create Form */}
      {isCreating && (
        <TicketTierForm
          eventId={eventId}
          onCancel={() => setIsCreating(false)}
          onSuccess={() => {
            setIsCreating(false);
            onTierAdded();
            setToast({ open: true, message: "Ticket tier created successfully!", severity: "success" });
          }}
        />
      )}

      {/* List */}
      <Stack spacing={3}>
        {tiersData.map((tier) => (
          editingTierId === tier.id ? (
            <TicketTierForm
              key={tier.id}
              eventId={eventId}
              tier={tier}
              onCancel={() => setEditingTierId(null)}
              onSuccess={() => {
                setEditingTierId(null);
                onTierAdded();
                setToast({ open: true, message: "Ticket tier updated successfully!", severity: "success" });
              }}
            />
          ) : (
            <TicketTierCard 
              key={tier.id} 
              tier={tier} 
              onEdit={() => setEditingTierId(tier.id)} 
            />
          )
        ))}
        {tiersData.length === 0 && (
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ textAlign: "center", py: 5 }}
          >
            No ticket tiers available for this event yet.
          </Typography>
        )}
      </Stack>

      {/* Success/Error Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "12px" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TicketTiersList;
