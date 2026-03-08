"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { LockClosedIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

interface AccessDeniedViewProps {
  title?: string;
  message?: string;
  requiredRoles?: string[];
  currentRole?: string;
}

const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  title = "Access Restricted",
  message = "You don't have the necessary permissions to view this section.",
  requiredRoles,
  currentRole,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        p: 4,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Box
          sx={{
            size: 100,
            width: 100,
            height: 100,
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            bgcolor: "rgba(238, 43, 140, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
            border: "2px solid #ee2b8c",
            boxShadow: "0 0 20px rgba(238, 43, 140, 0.3)",
            position: "relative",
            margin: "0 auto 32px",
            animation: "morph 8s ease-in-out infinite",
            "@keyframes morph": {
              "0%, 100%": { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" },
              "50%": { borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%" },
            },
          }}
        >
          <LockClosedIcon className="w-12 h-12 text-[#ee2b8c]" />
        </Box>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: "text.primary",
            mb: 2,
            textTransform: "uppercase",
            letterSpacing: -1,
            fontSize: { xs: "2rem", md: "3rem" },
            background: "linear-gradient(45deg, #ee2b8c 30%, #ff00de 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 10px 20px rgba(238, 43, 140, 0.2)",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 500,
            mx: "auto",
            mb: 4,
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          {message}
          {currentRole && (
            <Box mt={2}>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: "rgba(238, 43, 140, 0.1)",
                  color: "#ee2b8c",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "4px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  border: "1px solid rgba(238, 43, 140, 0.2)",
                }}
              >
                Current Role: {currentRole}
              </Typography>
            </Box>
          )}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            component={Link}
            href="/dashboard"
            variant="contained"
            startIcon={<ArrowLeftIcon className="w-5 h-5" />}
            sx={{
              bgcolor: "black",
              color: "white",
              fontWeight: 800,
              px: 4,
              py: 1.5,
              borderRadius: 0,
              textTransform: "uppercase",
              border: "2px solid #ee2b8c",
              boxShadow: "6px 6px 0px 0px #ee2b8c",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "#ee2b8c",
                transform: "translate(-2px, -2px)",
                boxShadow: "8px 8px 0px 0px black",
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default AccessDeniedView;
