"use client";

import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import OrganizerOrderList from "@/features/orders/components/OrganizerOrderList";
import { useGetOrders } from "@/features/orders/hooks/useOrders";
import { useOrgRole } from "@/hooks/useOrgRole";
import { Box, Tab, Tabs, Typography, Paper, Alert } from "@mui/material";
import { useState } from "react";

export default function OrganizerTransactionsView() {
  const role = useOrgRole();
  const { user } = useStoreLogin();
  const canManageTransactions = role === "OWNER" || role === "ADMIN";

  const { data, isLoading, error } = useGetOrders({
    limit: 100,
    ...(user?.organizer?.id ? { organizerId: user.organizer.id } : {}),
  });

  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const allTransactions = data?.data || [];
  const filteredTransactions = allTransactions.filter((tx: any) => {
    if (tab === 1) return tx.status === "PENDING";
    if (tab === 2) return tx.status === "PAID";
    return true;
  });

  if (!canManageTransactions) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Alert severity="error" variant="filled">
          You do not have permission to view this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto", w: "100%" }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
          Event Transactions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and monitor all payments, orders, and transactions across your events.
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="transaction tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
            },
          }}
        >
          <Tab label="All Transactions" />
          <Tab label="Pending Payments" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          Failed to load transactions. Please try again later.
        </Alert>
      ) : (
        <OrganizerOrderList
          orders={filteredTransactions}
          isLoading={isLoading}
        />
      )}
    </Box>
  );
}
