"use client";

import React from "react";
import { useManageTicketsData } from "../hooks/useManageTicketsData";
import {
  Alert,
  Box,
  Breadcrumbs,
  CircularProgress,
  Container,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import EventSummaryHeader from "./EventSummaryHeader";
import TicketTiersList from "./TicketTiersList";

interface IManageTicketsViewProps {
  eventId: string;
}

const ManageTicketsView: React.FC<IManageTicketsViewProps> = ({ eventId }) => {
  const { data, isLoading, error, refetch } = useManageTicketsData(eventId);

  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        overflowY: "auto",
        p: { xs: 2, md: 4 },
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={
            <NavigateNextIcon
              fontSize="small"
              sx={{ color: "text.secondary", fontSize: 16 }}
            />
          }
          aria-label="breadcrumb"
          sx={{ mb: 4 }}
        >
          <MuiLink
            component={Link}
            href="/dashboard/events"
            underline="hover"
            color="text.secondary"
            sx={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            My Events
          </MuiLink>
          <Typography
            color="text.primary"
            sx={{ fontSize: "0.875rem", fontWeight: 800 }}
          >
            Manage Tickets
          </Typography>
        </Breadcrumbs>

        {/* Content */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : data ? (
          <>
            {/* Event Summary Header */}
            <Box sx={{ mb: 4 }}>
              <EventSummaryHeader event={data} />
            </Box>

            {/* Grid Layout for Main Content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: 4,
              }}
            >
              {/* Left Column */}
              <Box sx={{ flex: { xs: "1 1 auto", } }}>
                <TicketTiersList
                  eventId={eventId}
                  tiersData={data.ticketTiers}
                  onTierAdded={refetch}
                />
              </Box>
            </Box>
          </>
        ) : null}
      </Container>
    </Box>
  );
};

export default ManageTicketsView;
