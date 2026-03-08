import React, { useState } from "react";
import { Order } from "../types/orders.types";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import ReviewModal from "@/features/reviews/components/ReviewModal";
import { groupOrderItemsByOrganizer } from "../utils/groupOrders";

interface IOrderDetailProps {
  order: Order;
  isPaying?: boolean;
  onPay?: () => void;
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

const OrderDetail: React.FC<IOrderDetailProps> = ({
  order,
  isPaying = false,
  onPay,
  isOrganizerView = false,
}) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Calculate total discount from vouchers/coupons
  const totalDiscount = React.useMemo(() => {
    const original = Number(order.totalOriginalPrice) || 0;
    const final = Number(order.totalFinalPrice) || 0;
    const points = Number(order.pointsUsed) || 0;
    return Math.max(0, original - final - points);
  }, [order]);

  return (
    <Box
      className="max-w-2xl mx-auto px-2 sm:px-0"
      sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 4 } }}
    >
      {/* Header */}
      <Box
        className="border-b-4 !border-black dark:!border-neon-cyan pb-6"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "flex-end" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography className="font-display font-black uppercase tracking-tighter text-base md:text-3xl text-black dark:text-white mb-1 md:mb-2">
            Order Number:{" "}
            <Box
              component="span"
              className="text-neon-magenta select-all drop-shadow-[0_0_5px_rgba(255,0,229,0.3)]"
            >
              {order.invoice}
            </Box>
          </Typography>
          <Typography className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[8px] md:text-xs">
            {format(new Date(order.transactionDate), "dd MMMM yyyy HH:mm")}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "flex-start", md: "flex-end" },
          }}
        >
          <Typography className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px] mb-1">
            Status
          </Typography>
          <Box
            component="span"
            className={`px-3 md:px-4 py-1.5 font-black text-[8px] md:text-xs uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(0,240,255,0.4)] ${getStatusColor(order.status)}`}
          >
            {order.status}
          </Box>
        </Box>
      </Box>

      {/* Main Content - Single Column Mobile First */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Order Items Card */}
        <Card
          className="brutalist-card border-[3px] !border-black dark:!border-neon-cyan dark:shadow-[8px_8px_0_0_rgba(0,240,255,0.4)] !bg-white dark:!bg-[#0a0a0a]"
          sx={{ borderRadius: 0 }}
        >
          <CardContent
            sx={{
              p: { xs: 2, md: 4 },
              "&:last-child": { pb: { xs: 2, md: 4 } },
            }}
          >
            <Typography
              variant="h5"
              className="font-display font-black uppercase tracking-tighter mb-4 text-black dark:text-white text-base md:text-2xl"
            >
              Vibes Included
            </Typography>
            <Divider className="!border-black dark:!border-neon-cyan !border-[1.5px] mb-6" />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {groupOrderItemsByOrganizer(order.items).map((group) => (
                <Box
                  key={group.organizerId}
                  sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        height: "2px",
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.1)",
                        dark: { backgroundColor: "rgba(255,255,255,0.1)" },
                      }}
                      className="bg-black/10 dark:bg-white/10"
                    />
                    <Typography className="font-display font-black uppercase text-[10px] tracking-widest text-neon-purple dark:text-neon-cyan whitespace-nowrap">
                      EO: {group.organizerName}
                    </Typography>
                    <Box
                      sx={{
                        height: "2px",
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.1)",
                        dark: { backgroundColor: "rgba(255,255,255,0.1)" },
                      }}
                      className="bg-black/10 dark:bg-white/10"
                    />
                  </Box>

                  {group.eventGroups.map((eg) => (
                    <Box
                      key={eg.eventId}
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {/* Event Name Header */}
                      <Typography className="font-black uppercase text-[9px] md:text-xs tracking-widest text-gray-600 dark:text-gray-300 pl-1 border-l-4 border-neon-purple dark:border-neon-cyan ml-1">
                        🎤 {eg.eventName}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          pl: 1,
                        }}
                      >
                        {eg.items.map((item) => (
                          <Box
                            key={item.id}
                            className="border-2 border-dashed !border-gray-300 dark:!border-neon-purple p-4"
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography className="text-neon-purple dark:text-neon-cyan font-black uppercase text-[8px] md:text-[10px] tracking-widest">
                                {item.ticketType.name}
                              </Typography>
                              <Typography className="text-gray-500 dark:text-gray-400 font-bold mt-1 md:mt-2 text-[8px] md:text-xs">
                                Price: IDR{" "}
                                {Number(item.ticketType.price).toLocaleString(
                                  "id-ID",
                                )}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                textAlign: { xs: "left", sm: "right" },
                                display: "flex",
                                flexDirection: { xs: "row", sm: "column" },
                                justifyContent: "space-between",
                                alignItems: { xs: "center", sm: "flex-end" },
                                pt: { xs: 2, sm: 0 },
                                borderTop: {
                                  xs: "1px dashed #eee",
                                  sm: "none",
                                },
                              }}
                              className="dark:!border-t-neon-cyan/50 sm:dark:!border-t-0"
                            >
                              <Box>
                                <Typography className="font-black text-[10px] md:text-sm text-black dark:text-white inline-block mr-2 sm:block sm:mr-0">
                                  x {item.quantity}
                                </Typography>
                                <Typography className="font-display font-black text-sm md:text-lg text-black dark:text-neon-cyan sm:mt-1">
                                  IDR{" "}
                                  {(
                                    Number(item.ticketType.price) *
                                    item.quantity
                                  ).toLocaleString("id-ID")}
                                </Typography>
                              </Box>
                              {order.status === "PAID" &&
                                !isOrganizerView &&
                                item.ticketType.event?.endDate &&
                                new Date() >
                                  new Date(item.ticketType.event.endDate) && (
                                  <Button
                                    size="small"
                                    onClick={() => setIsReviewOpen(true)}
                                    className="bg-neon-magenta text-white sm:mt-4 brutalist-button hover:shadow-neon-pink"
                                    sx={{
                                      py: 0.5,
                                      px: 1.5,
                                      fontSize: "0.8rem",
                                      fontWeight: 900,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.05em",
                                      boxShadow: "3px 3px 0 0 #000",
                                      border: "2px solid black",
                                      borderRadius: 0,
                                      "&:hover": {
                                        backgroundColor: "#ff008a",
                                        transform: "translate(-2px, -2px)",
                                        color: "white",
                                      },
                                    }}
                                  >
                                    Review Vibe
                                  </Button>
                                )}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card
          className="brutalist-card border-[3px] !border-black dark:!border-neon-magenta dark:shadow-[8px_8px_0_0_rgba(255,0,229,0.4)] !bg-white dark:!bg-[#0a0a0a]"
          sx={{ borderRadius: 0 }}
        >
          <CardContent
            sx={{
              p: { xs: 2, md: 4 },
              "&:last-child": { pb: { xs: 2, md: 4 } },
            }}
          >
            <Typography
              variant="h5"
              className="font-display font-black uppercase tracking-tighter mb-4 text-black dark:text-white text-base md:text-2xl"
            >
              Summary
            </Typography>
            <Divider className="!border-black dark:!border-neon-magenta !border-[1.5px] mb-6" />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 4,
                mt: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[8px] md:text-xs">
                  Payment Method
                </Typography>
                <Typography className="font-black uppercase text-[8px] md:text-xs text-black dark:text-neon-cyan">
                  {order.paymentMethod.replace(/_/g, " ")}
                </Typography>
              </Box>

              {/* Original Price (before any discount) */}
              <Box display="flex" justifyContent="space-between">
                <Typography className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[8px] md:text-xs">
                  Original Total
                </Typography>
                <Typography className="font-black text-[8px] md:text-xs text-black dark:text-white">
                  IDR {Number(order.totalOriginalPrice).toLocaleString("id-ID")}
                </Typography>
              </Box>

              {/* Event Promotions (from items) — show actual IDR discount */}
              {(() => {
                // Calculate promo discount per promotion by comparing item original vs actual
                const promoMap = new Map<
                  string,
                  {
                    name: string;
                    code: string;
                    discountPercentage?: number | null;
                    discountAmount?: number | null;
                    totalSaved: number;
                  }
                >();
                order.items.forEach((item) => {
                  if (item.promotion) {
                    const originalItemPrice =
                      Number(item.pricePerUnit) * item.quantity;
                    const actualItemPrice = Number(item.totalPrice);
                    const saved = Math.max(
                      0,
                      originalItemPrice - actualItemPrice,
                    );
                    const existing = promoMap.get(item.promotion.id);
                    promoMap.set(item.promotion.id, {
                      ...item.promotion,
                      totalSaved: (existing?.totalSaved || 0) + saved,
                    });
                  }
                });
                const uniquePromos = Array.from(promoMap.values());
                return uniquePromos.map((promo, idx) => (
                  <Box
                    key={idx}
                    display="flex"
                    justifyContent="space-between"
                    className="text-neon-cyan"
                  >
                    <Typography className="font-bold uppercase text-[8px] md:text-xs">
                      Discount: {promo.code}{" "}
                      {promo.discountPercentage
                        ? ` · ${Number(promo.discountPercentage)}%`
                        : ""}
                    </Typography>
                    <Typography className="font-black text-[8px] md:text-xs text-neon-cyan shadow-neon-cyan">
                      - IDR {promo.totalSaved.toLocaleString("id-ID")}
                    </Typography>
                  </Box>
                ));
              })()}

              {/* Points Used */}
              {order.pointsUsed > 0 && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  className="text-neon-magenta"
                >
                  <Typography className="font-bold uppercase text-[8px] md:text-xs">
                    Points Burned
                  </Typography>
                  <Typography className="font-black text-[8px] md:text-xs text-neon-pink shadow-neon-pink/20">
                    - IDR {Number(order.pointsUsed).toLocaleString("id-ID")}
                  </Typography>
                </Box>
              )}

              {/* Referral Coupon — compute actual IDR saved */}
              {order.userCoupon &&
                (() => {
                  // couponDiscount = original - promoDiscount - points - final
                  const original = Number(order.totalOriginalPrice) || 0;
                  const final = Number(order.totalFinalPrice) || 0;
                  const points = Number(order.pointsUsed) || 0;
                  // Promo discount from items
                  let promoDisc = 0;
                  order.items.forEach((item) => {
                    if (item.promotion) {
                      promoDisc += Math.max(
                        0,
                        Number(item.pricePerUnit) * item.quantity -
                          Number(item.totalPrice),
                      );
                    }
                  });
                  const couponSaved = Math.max(
                    0,
                    original - promoDisc - points - final,
                  );
                  return (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      sx={{ color: "#FF00FF" }}
                    >
                      <Typography
                        className="font-bold uppercase text-[8px] md:text-xs"
                        sx={{ color: "#FF00FF" }}
                      >
                        Referral Coupon
                        <span className="ml-1 font-mono text-[7px] md:text-[10px] opacity-70 lowercase">
                          ({order.userCoupon.code} ·{" "}
                          {Number(order.userCoupon.discountPercentage)}%)
                        </span>
                      </Typography>
                      <Typography
                        className="font-black text-[8px] md:text-xs"
                        sx={{ color: "#FF00FF" }}
                      >
                        - IDR {couponSaved.toLocaleString("id-ID")}
                      </Typography>
                    </Box>
                  );
                })()}
            </Box>

            <Divider className="!border-black dark:!border-neon-magenta border-t-2 border-dashed mb-6" />

            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
              mb={4}
            >
              <Typography className="font-black uppercase text-[8px] md:text-xs text-gray-500 dark:text-gray-400 mb-1">
                Grand Total
              </Typography>
              <Typography className="font-display font-black text-base md:text-3xl text-neon-purple dark:text-neon-cyan tracking-tighter drop-shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                IDR {Number(order.totalFinalPrice).toLocaleString("id-ID")}
              </Typography>
            </Box>

            {order.status === "PENDING" && isOrganizerView && (
              <Button
                fullWidth
                onClick={onPay}
                disabled={isPaying}
                className="border-2 border-black dark:border-neon-cyan bg-neon-cyan text-black brutalist-button shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#00e5ff]"
                sx={{
                  py: { xs: 1, md: 2 },
                  fontSize: { xs: "0.6rem", md: "0.875rem" },
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  borderRadius: 0,
                  "&:hover": {
                    backgroundColor: "#00e5ff",
                    transform: "translate(-2px, -2px)",
                    boxShadow: "8px 8px 0 0 #000",
                  },
                  transition: "all 0.2s",
                }}
              >
                {isPaying ? "Writing to DB..." : "Confirm Vibe"}
              </Button>
            )}
            
            {order.status === "PAID" && (
              <Box className="w-full py-2 md:py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[8px] md:text-xs text-center border-4 border-black dark:border-neon-cyan shadow-neon/10">
                Vibe Secured
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {order.items?.length > 0 && (
        <ReviewModal
          open={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          transactionItemId={order.items[0].id}
        />
      )}
    </Box>
  );
};

export default OrderDetail;
