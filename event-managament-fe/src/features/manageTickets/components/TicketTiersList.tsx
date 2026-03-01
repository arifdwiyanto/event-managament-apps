"use client";

import React, { useState } from "react";
import { TicketTierData } from "../types/ticketTierData.types";
import { Box, Button, Stack, Typography } from "@mui/material";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import AddIcon from "@mui/icons-material/Add";
import TicketTierCard from "./TicketTierCard";
import CreateTicketTierForm from "./CreateTicketTierForm";

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
  const [isCreating, setIsCreating] = useState(false);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ConfirmationNumberOutlinedIcon
            sx={{ color: "#ee2b8c", fontSize: 28 }}
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

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
          sx={{
            bgcolor: "#181114",
            color: "white",
            borderRadius: 6,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              bgcolor: "#2b2226",
            },
          }}
        >
          Add New Tier
        </Button>
      </Box>

      {/* Create Form */}
      {isCreating && (
        <CreateTicketTierForm
          eventId={eventId}
          onCancel={() => setIsCreating(false)}
          onSuccess={() => {
            setIsCreating(false);
            onTierAdded();
          }}
        />
      )}

      {/* List */}
      <Stack spacing={3}>
        {tiersData.map((tier) => (
          <TicketTierCard key={tier.id} tier={tier} />
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
    </Box>
  );
};

export default TicketTiersList;
