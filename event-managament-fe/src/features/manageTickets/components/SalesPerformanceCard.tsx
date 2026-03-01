import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

interface ISalesPerformanceCardProps {
  ticketsSold: number;
  goal: number;
}

const SalesPerformanceCard: React.FC<ISalesPerformanceCardProps> = ({
  ticketsSold,
  goal,
}) => {
  const percentage = goal > 0 ? Math.round((ticketsSold / goal) * 100) : 0;
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 1,
        background: "linear-gradient(145deg, #2b111b 0%, #4a1532 100%)", // Dark purple/pink gradient
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          bgcolor: "#ee2b8c",
          opacity: 0.15,
          filter: "blur(40px)",
          borderRadius: "50%",
        }}
      />

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
          zIndex: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}
        >
          Event Sales Performance
        </Typography>
        <IconButton
          size="small"
          sx={{
            color: "white",
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <PersonAddAlt1Icon fontSize="small" />
        </IconButton>
      </Box>

      {/* Big Numbers */}
      <Box sx={{ zIndex: 1, mb: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            fontFamily: "var(--font-display)",
            letterSpacing: "-1px",
            mb: 0,
          }}
        >
          {ticketsSold.toLocaleString()}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}
        >
          Ticket sold
        </Typography>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ zIndex: 1, mb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          >
            Goal: {goal.toLocaleString()} tickets
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "white", fontWeight: 800, fontSize: "0.75rem" }}
          >
            {percentage}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.1)",
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 3,
              background: "linear-gradient(90deg, #9c27b0 0%, #ee2b8c 100%",
            },
          }}
        />
      </Box>

      <Box sx={{ mt: 3, zIndex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.7)",
            fontWeight: 600,
            display: "block",
            mb: 1.5,
          }}
        >
          Top Buyers
        </Typography>
        <AvatarGroup
          max={4}
          sx={{
            justifyContent: "flex-end",
            flexDirection: "row-reverse",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              fontSize: "0.75rem",
              borderColor: "#3a1327",
              borderWidth: 2,
            },
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
          <Avatar
            alt="Travis Howard"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
          <Avatar
            alt="Cindy Baker"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
          <Avatar
            alt="Agnes Walker"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
          <Avatar
            alt="Trevor Henderson"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
        </AvatarGroup>
      </Box>
    </Paper>
  );
};

export default SalesPerformanceCard;
