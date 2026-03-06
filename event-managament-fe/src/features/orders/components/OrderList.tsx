"use client";

import React from "react";
import { Order } from "../types/orders.types";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { EyeIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface IOrderListProps {
  orders: Order[];
  isLoading: boolean;
  isOrganizerView?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-neon-cyan text-black";
    case "PENDING":
      return "bg-yellow-400 text-black";
    case "CANCELED":
      return "bg-red-500 text-white";
    case "REFUNDED":
      return "bg-neon-purple text-white";
    default:
      return "bg-gray-200 text-black";
  }
};

const OrderList: React.FC<IOrderListProps> = ({
  orders,
  isLoading = false,
  isOrganizerView = false,
}) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={6}>
        <Typography className="font-display font-black uppercase text-xl animate-pulse">
          Loading you vibes...
        </Typography>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={6}
        className="border-4 !border-black dark:!border-neon-cyan border-dashed"
      >
        <Typography className="font-display font-black uppercase text-xl tracking-widest text-gray-500">
          No Orders Found
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/")}
          className="!bg-black dark:!bg-white !text-white dark:!text-black hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0_0_#ee2b8c] transiton-all duration-200"
          sx={{
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            borderRadius: 0,
            padding: "8px 24px",
          }}
        >
          Explore Events
        </Button>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      className="border-4 !border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] !bg-white dark:!bg-[#0a0a0a] dark:!border-neon-cyan dark:shadow-[8px_8px_0px_0px_rgba(0,255,255,0.4)]"
      sx={{ borderRadius: 0 }}
    >
      <Table>
        <TableHead>
          <TableRow className="!bg-black dark:!bg-[#111] border-b-4 !border-black dark:!border-neon-cyan">
            <TableCell className="!text-white dark:!text-neon-cyan font-display font-black uppercase text-sm tracking-widest border-0">
              Invoice
            </TableCell>
            <TableCell className="!text-white dark:!text-neon-cyan font-display font-black uppercase text-sm tracking-widest border-0">
              Event
            </TableCell>
            <TableCell className="!text-white dark:!text-neon-cyan font-display font-black uppercase text-sm tracking-widest border-0">
              Date
            </TableCell>
            <TableCell className="!text-white dark:!text-neon-cyan font-display font-black uppercase text-sm tracking-widest border-0">
              Total
            </TableCell>
            <TableCell className="!text-white dark:!text-neon-cyan font-display font-black uppercase text-sm tracking-widest border-0">
              Status
            </TableCell>
            <TableCell className="!text-white dark:!text-neon-cyan font-display font-black uppercase text-sm tracking-widest border-0 text-center">
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map((order, index) => (
            <TableRow
              key={order.id}
              className={`hover:bg-gray-50 dark:hover:bg-white/10 transition-colors`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell className="border-b !border-black/20 dark:!border-white/20 font-bold text-sm text-black dark:text-white">
                {order.invoice}
              </TableCell>
              <TableCell className="border-b !border-black/20 dark:!border-white/20">
                <Typography className="font-bold text-sm uppercase truncate max-w-[200px] text-black dark:text-white">
                  {order.event?.name || "Unknown Event"}
                </Typography>
              </TableCell>
              <TableCell className="border-b !border-black/20 dark:!border-white/20 text-sm text-gray-600 dark:text-gray-400 font-bold uppercase">
                {format(new Date(order.transactionDate), "dd MMM yyyy")}
              </TableCell>
              <TableCell className="border-b !border-black/20 dark:!border-white/20 font-black font-display text-neon-purple dark:text-neon-cyan">
                {`Rp ${Number(order.totalFinalPrice).toLocaleString("id-ID")}`}
              </TableCell>
              <TableCell className="border-b !border-black/20 dark:!border-white/20">
                <Box
                  component="span"
                  className={`px-3 py-1 font-black text-[10px] uppercase tracking-widest ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </Box>
              </TableCell>
              <TableCell className="border-b !border-black/20 dark:!border-white/20 text-center">
                <Button
                  onClick={() =>
                    router.push(
                      isOrganizerView
                        ? `/dashboard/transactions/${order.id}`
                        : `/user/orders/${order.id}`,
                    )
                  }
                  title="View Details"
                  className="border-2 !border-black dark:!border-neon-magenta text-black dark:!text-neon-magenta hover:!bg-neon-magenta hover:!border-neon-magenta hover:!text-white transition-all duration-200"
                  sx={{
                    minWidth: "auto",
                    padding: "8px",
                    borderRadius: 0,
                  }}
                >
                  <EyeIcon className="size-4" strokeWidth={2.5} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderList;
