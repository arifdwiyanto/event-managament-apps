"use client";

import React from "react";
import { Order } from "../types/orders.types";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  Chip,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";

interface IOrganizerOrderDetailProps {
  order: Order;
  isPaying?: boolean;
  onPay?: () => void;
  isOrganizerView?: boolean;
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

const OrganizerOrderDetail: React.FC<IOrganizerOrderDetailProps> = ({
  order,
  isPaying = false,
  onPay,
  isOrganizerView = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Calculate total discount from vouchers/coupons
  const totalDiscount = React.useMemo(() => {
    const original = Number(order.totalOriginalPrice) || 0;
    const final = Number(order.totalFinalPrice) || 0;
    const points = Number(order.pointsUsed) || 0;
    return Math.max(0, original - final - points);
  }, [order]);

  const displayInvoice = isMobile && order.invoice.length > 20
    ? `${order.invoice.slice(0, 20)}...`
    : order.invoice;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2.5, sm: 3 } }}>
      {/* Header Info */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: { xs: 1.5, md: 2 }, mb: { xs: 0.5, md: 1 } }}>
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 0.5, sm: 1 }, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            <span>Order Number:</span>
            <Tooltip title={order.invoice} placement="top-start" enterTouchDelay={0}>
              <Typography 
                component="span" 
                variant="h5" 
                color="primary" 
                sx={{ 
                  userSelect: 'all', 
                  fontWeight: 700, 
                  fontSize: 'inherit',
                  display: 'inline-block',
                  maxWidth: '100%',
                  wordBreak: 'break-all',
                }}
              >
                {displayInvoice}
              </Typography>
            </Tooltip>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {format(new Date(order.transactionDate), "dd MMMM yyyy HH:mm")}
          </Typography>
        </Box>
        <Box textAlign={{ xs: "left", md: "right" }}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5} fontWeight={600} textTransform="uppercase" sx={{ display: { xs: 'none', md: 'block' } }}>
            Status
          </Typography>
          <Chip
            label={getStatusLabel(order.status, !!order.paymentProofUrl)}
            color={getStatusColor(order.status, !!order.paymentProofUrl) as any}
            size="small"
            sx={{ fontWeight: 600, letterSpacing: 0.5, px: 1, py: { xs: 1.5, sm: 0 }, fontSize: { xs: '0.7rem', sm: '0.8125rem' } }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 3, md: 4 }, "&:last-child": { pb: { xs: 2, sm: 3, md: 4 } } }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            Order Items
          </Typography>
          <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
            {order.items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  p: { xs: 1.5, sm: 2 },
                  bgcolor: "background.default",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box sx={{ mb: { xs: 1.5, sm: 0 } }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, leadingTrim: 'tight', mb: 0.5 }}>
                    {order.event?.name}
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {item.ticketType.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: { xs: 1, sm: 0 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Price: Rp {Number(item.ticketType.price).toLocaleString("id-ID")}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: { xs: "left", sm: "right" }, borderTop: { xs: "1px dashed", sm: "none" }, borderColor: "divider", pt: { xs: 1.5, sm: 0 }, display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-end' } }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, mb: { xs: 0, sm: 0.5 } }}>
                    Qty: {item.quantity}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                    Rp {(Number(item.ticketType.price) * item.quantity).toLocaleString("id-ID")}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 3, md: 4 }, "&:last-child": { pb: { xs: 2.5, sm: 3, md: 4 } } }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            Payment Details
          </Typography>
          <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, sm: 1.5 }, mb: { xs: 3, sm: 4 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Payment Method</Typography>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{order.paymentMethod.replace(/_/g, " ")}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Original Total</Typography>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Rp {Number(order.totalOriginalPrice).toLocaleString("id-ID")}</Typography>
            </Box>

            {order.pointsUsed > 0 && (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Points Applied</Typography>
                <Typography variant="body2" color="error.main" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  - Rp {Number(order.pointsUsed).toLocaleString("id-ID")}
                </Typography>
              </Box>
            )}

            {totalDiscount > 0 && (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Discount</Typography>
                <Typography variant="body2" color="error.main" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  - Rp {totalDiscount.toLocaleString("id-ID")}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: { xs: 1.5, sm: 2 }, borderStyle: "dashed" }} />

            <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 0.5, sm: 0 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' }, color: { xs: 'text.secondary', sm: 'text.primary' } }}>Grand Total</Typography>
              <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                Rp {Number(order.totalFinalPrice).toLocaleString("id-ID")}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          {order.status === "PENDING" && isOrganizerView && (
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={onPay}
              disabled={isPaying}
              sx={{ py: { xs: 1.5, sm: 2 }, fontWeight: 700, fontSize: { xs: '0.8rem', sm: '0.9rem' }, letterSpacing: 0.5 }}
            >
              {isPaying ? "Processing..." : "Confirm Payment"}
            </Button>
          )}

          {order.status === "PAID" && (
            <Box
              sx={{
                width: "100%",
                p: { xs: 1.5, sm: 2 },
                bgcolor: "success.light",
                color: "success.contrastText",
                borderRadius: 2,
                textAlign: "center",
                fontWeight: 700,
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                letterSpacing: 0.5,
              }}
            >
              PAYMENT COMPLETED
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrganizerOrderDetail;
