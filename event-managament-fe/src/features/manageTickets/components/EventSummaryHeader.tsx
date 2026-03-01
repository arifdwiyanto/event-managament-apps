import * as React from "react";
import { ManageTicketsEventData } from "../hooks/useManageTicketsData";
import { format } from "date-fns";
import { Avatar, Box, Chip, Divider, Paper, Typography } from "@mui/material";

interface IEventSummaryHeaderProps {
  event: ManageTicketsEventData;
}

const EventSummaryHeader: React.FC<IEventSummaryHeaderProps> = ({ event }) => {
  const formattedDate = event.startDate
    ? format(new Date(event.startDate), "dd MMM yyyy")
    : "TBA";

  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        alignItems: "center",
      }}
    >
      {/* Left side */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          flex: 1,
          alignItems: "center",
        }}
      >
        <Avatar
          src={event.imageUrl}
          alt={event.name}
          variant="rounded"
          sx={{
            width: { xs: 180, md: 220 },
            height: { xs: 120, md: 140 },
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            textAlign: { xs: "center", sm: "left" },
            mt: { xs: 0, sm: 1 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: { xs: "center", sm: "flex-start" },
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={event.status}
              size="small"
              sx={{
                bgcolor: "#e8f5e9",
                color: "#2e7d32",
                fontWeight: 800,
                fontSize: "0.7rem",
                border: "1px solid #c8e6c9",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            >
              {formattedDate} • {event.location}
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              letterSpacing: "-1px",
              color: "text.primary",
              mt: 0.5,
            }}
          >
            {event.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              maxWidth: 500,
              lineHeight: 1.6,
            }}
          >
            Manage your ticket inventory, pricing tiers, and monitor sales
            performance in real-time for the upcoming event.
          </Typography>
        </Box>
      </Box>

      {/* Right side */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, md: 4 },
          alignItems: "center",
          px: { xs: 0, md: 2 },
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="overline"
            sx={{
              color: "text.secondary",
              fontWeight: 800,
              letterSpacing: "1px",
            }}
          >
            SOLD
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#f50057",
              fontFamily: "var(--font-display)",
            }}
          >
            {event.ticketsSoldTotal.toLocaleString()}
          </Typography>
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", sm: "block" },
            borderColor: "divider",
            borderWidth: 1,
          }}
        />

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="overline"
            sx={{
              color: "text.secondary",
              fontWeight: 800,
              letterSpacing: "1px",
            }}
          >
            TOTAL
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              fontFamily: "var(--font-display)",
            }}
          >
            {event.ticketsTotalCapacity.toLocaleString()}
          </Typography>
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", sm: "block" },
            borderColor: "divider",
            borderWidth: 1,
          }}
        />

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="overline"
            sx={{
              color: "text.secondary",
              fontWeight: 800,
              letterSpacing: "1px",
            }}
          >
            REVENUE
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#00b050",
              fontFamily: "var(--font-display)",
            }}
          >
            {formatRevenue(event.calculatedRevenue)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default EventSummaryHeader;
