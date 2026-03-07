import * as React from "react";
import { ManageTicketsEventData } from "../hooks/useManageTicketsData";
import { format } from "date-fns";
import { Avatar, Box, Chip, Divider, Paper, Typography, Tooltip, LinearProgress, linearProgressClasses } from "@mui/material";

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

  const percentage = event.ticketsTotalCapacity > 0 
    ? Math.round((event.ticketsSoldTotal / event.ticketsTotalCapacity) * 100) 
    : 0;

  return (
      <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, md: 4 },
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          alignItems: { xs: "center", sm: "flex-start" },
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Avatar
          src={event.imageUrl}
          alt={event.name}
          variant="rounded"
          sx={{
            width: { xs: "100%", sm: 140, md: 160 },
            height: { xs: 160, sm: 94, md: 108 },
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            textAlign: { xs: "center", sm: "left" },
            mt: { xs: 1, sm: 0 },
            flex: 1,
            minWidth: 0,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              justifyContent: { xs: "center", sm: "flex-start" },
              flexWrap: { xs: "wrap", md: "nowrap" },
              width: "100%",
            }}
          >
            <Chip
              label={event.status}
              size="small"
              sx={(theme) => ({
                bgcolor: theme.palette.mode === "dark" ? "rgba(46, 125, 50, 0.2)" : "#e8f5e9",
                color: theme.palette.mode === "dark" ? "#81c784" : "#2e7d32",
                fontWeight: 800,
                fontSize: "0.7rem",
                border: "1px solid",
                borderColor: theme.palette.mode === "dark" ? "rgba(129, 199, 132, 0.3)" : "#c8e6c9",
              })}
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

          <Tooltip title={event.name} placement="top-start" enterTouchDelay={0}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: { xs: "1.5rem", md: "1.75rem", lg: "2rem" },
                letterSpacing: "-0.5px",
                color: "text.primary",
                mt: 0.5,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "help",
                display: "block",
                width: "100%",
              }}
            >
              {event.name}
            </Typography>
          </Tooltip>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              maxWidth: { xs: "100%", lg: 800 },
              lineHeight: 1.5,
              fontSize: { xs: "0.8rem", md: "0.875rem" },
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            Manage your ticket inventory, pricing tiers, and monitor sales
            performance in real-time for the upcoming event.
          </Typography>
        </Box>
      </Box>

      {/* Divider for Stats */}
      <Divider sx={{ my: -1 }} />

      {/* Bottom Stats View */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2.5, sm: 4, md: 8 },
          alignItems: "center",
          px: { xs: 0, md: 2 },
          flexWrap: "wrap",
          justifyContent: "center",
          pb: 1,
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
            sx={(theme) => ({
              fontWeight: 800,
              color: theme.palette.mode === "dark" ? "#ff4081" : "#f50057",
              fontFamily: "var(--font-display)",
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            })}
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
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
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
            sx={(theme) => ({
              fontWeight: 800,
              color: theme.palette.mode === "dark" ? "#81c784" : "#00b050",
              fontFamily: "var(--font-display)",
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            })}
          >
            {formatRevenue(event.calculatedRevenue)}
          </Typography>
        </Box>
      </Box>

      {/* Sales Progress Bar */}
      <Box sx={{ px: { xs: 0, md: 2 }, mt: 0, pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
            }}
          >
            Sales Progress
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.primary", fontWeight: 800 }}
          >
            {percentage}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "action.hover",
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 4,
              background: "linear-gradient(90deg, #9c27b0 0%, #ee2b8c 100%)",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default EventSummaryHeader;
