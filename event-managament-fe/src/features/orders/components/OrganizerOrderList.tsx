"use client";

import React from "react";
import { Order } from "../types/orders.types";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import { EyeIcon } from "@heroicons/react/24/outline";

interface IOrganizerOrderListProps {
  orders: Order[];
  isLoading: boolean;
}

const getStatusColor = (status: string, hasProof: boolean = false) => {
  if (status === "PENDING" && hasProof) {
    return "info";
  }
  switch (status) {
    case "PAID":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELED":
      return "error";
    case "REFUNDED":
      return "default";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string, hasProof: boolean = false) => {
  if (status === "PENDING" && hasProof) {
    return "AWAITING VALIDATION";
  }
  return status;
};

const OrganizerOrderList: React.FC<IOrganizerOrderListProps> = ({
  orders,
  isLoading = false,
}) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={6} minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          border: "1px dashed",
          borderColor: "divider",
          backgroundColor: "transparent",
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Transactions Found
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          You don't have any orders or transactions yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="organizer transactions table">
        <TableHead sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Order Number</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Event</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Total Final Price</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              hover
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {order.invoice}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                  {order.event?.name || "Unknown Event"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(order.transactionDate), "dd MMM yyyy, HH:mm")}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  Rp {Number(order.totalFinalPrice).toLocaleString("id-ID")}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(order.status, !!order.paymentProofUrl)}
                  color={getStatusColor(order.status, !!order.paymentProofUrl) as any}
                  size="small"
                  sx={{ fontWeight: 600, fontSize: "0.7rem", letterSpacing: 0.5 }}
                />
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => router.push(`/dashboard/transactions/${order.id}`)}
                  startIcon={<EyeIcon className="w-4 h-4" />}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  View Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrganizerOrderList;
