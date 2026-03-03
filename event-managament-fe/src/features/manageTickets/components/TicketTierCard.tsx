import {
  Box,
  Chip,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  Paper,
  Typography,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import React from "react";
import { TicketTierData } from "../types/ticketTierData.types";

interface ITicketTierCardProps {
  tier: TicketTierData;
}

const TicketTierCard: React.FC<ITicketTierCardProps> = ({ tier }) => {
  let statusBg = "#e8f5e9";
  let statusColor = "#2e7d32";
  if (tier.status === "SOLD OUT") {
    statusBg = "#fff8e1";
    statusColor = "#f57f17";
  } else if (tier.status === "PAUSED") {
    statusBg = "#fff8e1";
    statusColor = "#f57f17";
  }

  const progressPercentage =
    tier.total > 0 ? (tier.sold / tier.total) * 100 : 0;
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        borderLeft: `5px solid ${tier.colorHex}`,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 3,
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          borderColor: "transparent",
        },
      }}
    >
      {/* Left Info */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              letterSpacing: "-0.5px",
            }}
          >
            {tier.name}
          </Typography>
          <Chip
            label={tier.status}
            size="small"
            sx={{
              bgcolor: statusBg,
              color: statusColor,
              fontWeight: 800,
              fontSize: "0.65rem",
              height: 20,
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 600 }}
        >
          {tier.priceStr} • {tier.subtitle}
        </Typography>
      </Box>

      {/* Right Data */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          width: { xs: "100%", sm: "auto" },
        }}
      >
        {/* Inventory Progress */}
        <Box sx={{ minWidth: { xs: "100%", sm: 160 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "baseline",
              mb: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 800,
                letterSpacing: "1px",
                mr: 2,
              }}
            >
              INVENTORY
            </Typography>
            <Box>
              <Typography
                component="span"
                variant="subtitle1"
                sx={{ fontWeight: 800, color: "text.primary" }}
              >
                {tier.sold.toLocaleString()}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 600 }}
              >
                / {tier.total.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "action.hover",
              [`& .${linearProgressClasses.bar}`]: {
                borderRadius: 3,
                backgroundColor:
                  progressPercentage === 0 ? "transparent" : tier.colorHex,
              },
            }}
          />
        </Box>

        {/* Settings Action */}
        <IconButton
          size="small"
          sx={{ color: "text.secondary", display: { xs: "none", sm: "flex" } }}
        >
          <TuneIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Mobile Settings Action */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          width: "100%",
          justifyContent: "flex-end",
          mt: -2,
        }}
      >
        <IconButton size="small" sx={{ color: "text.secondary" }}>
          <TuneIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default TicketTierCard;
