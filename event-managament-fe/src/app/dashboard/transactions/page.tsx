"use client";

import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import OrderList from "@/features/orders/components/OrderList";
import { useGetOrders } from "@/features/orders/hooks/useOrders";
import { useOrgRole } from "@/hooks/useOrgRole";
import { Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

export default function OrganizerTransactionsPage() {
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
      <div className="p-8">
        <Typography variant="h5" color="error">
          You do not have permission to view this page.
        </Typography>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Typography
          variant="h3"
          className="font-display font-black uppercase tracking-tighter text-black dark:text-white"
        >
          Event <span className="text-neon-cyan">Transactions</span>
        </Typography>
        <Typography className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-2">
          Manage all payments and orders for your events
        </Typography>
      </div>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        className="mb-6"
        sx={{
          "& .MuiTab-root": {
            fontWeight: "bold",
            fontFamily: "var(--font-inter)",
            textTransform: "uppercase",
          },
          "& .Mui-selected": {
            color: "#00e5ff !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#00e5ff",
          },
        }}
      >
        <Tab label="All Transactions" />
        <Tab label="Pending Payments" />
        <Tab label="Completed" />
      </Tabs>

      {error ? (
        <div className="p-4 border-4 border-red-500 bg-red-50 text-red-600 font-bold uppercase text-center">
          Failed to load transactions.
        </div>
      ) : (
        <OrderList
          orders={filteredTransactions}
          isLoading={isLoading}
          isOrganizerView={true}
        />
      )}
    </div>
  );
}
