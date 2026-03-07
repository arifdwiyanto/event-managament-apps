import {
  Box,
  Chip,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import React from "react";
import { TicketTierData } from "../types/ticketTierData.types";

interface ITicketTierCardProps {
  tier: TicketTierData;
  onEdit: () => void;
}

const TicketTierCard: React.FC<ITicketTierCardProps> = ({ tier, onEdit }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  let statusBg = isDark ? "rgba(46, 125, 50, 0.2)" : "#e8f5e9";
  let statusColor = isDark ? "#81c784" : "#2e7d32";
  if (tier.status === "SOLD OUT" || tier.status === "PAUSED") {
    statusBg = isDark ? "rgba(245, 127, 23, 0.2)" : "#fff8e1";
    statusColor = isDark ? "#ffb300" : "#f57f17";
  }

  const progressPercentage =
    tier.total > 0 ? (tier.sold / tier.total) * 100 : 0;
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2, md: 2.5 },
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        borderLeft: `5px solid ${tier.colorHex}`,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", sm: "center" },
        gap: { xs: 2, sm: 3 },
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          boxShadow: isDark
            ? "0 4px 20px rgba(0,0,0,0.5)"
            : "0 4px 20px rgba(0,0,0,0.05)",
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
              fontSize: { xs: "1rem", sm: "1.1rem" }
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
          sx={{ color: "text.secondary", fontWeight: 600, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
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
              justifyContent: "space-between",
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
          onClick={onEdit}
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
          mt: 0,
        }}
      >
        <IconButton size="small" onClick={onEdit} sx={{ color: "text.secondary", p: 0.5 }}>
          <TuneIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default TicketTierCard;
