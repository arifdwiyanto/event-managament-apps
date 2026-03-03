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
import { useUploadPaymentProof } from "../hooks/useOrders";
import ReviewModal from "@/features/reviews/components/ReviewModal";

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
  const uploadProofMutation = useUploadPaymentProof();
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleUploadProof = async () => {
    if (!proofFile) return;
    try {
      await uploadProofMutation.mutateAsync({ id: order.id, file: proofFile });
      setProofFile(null);
    } catch (error: any) {
      alert(error.message || "Failed to upload proof");
    }
  };

  return (
    <Box
      className="max-w-4xl mx-auto"
      sx={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      {/* Header */}
      <Box
        className="border-b-4 border-black dark:border-white/20 pb-6"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-end" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography className="font-display font-black uppercase tracking-tighter text-3xl text-black dark:text-white mb-2">
            Invoice:{" "}
            <Box component="span" className="text-neon-pink select-all">
              {order.invoice}
            </Box>
          </Typography>
          <Typography className="text-gray-500 font-bold uppercase tracking-widest text-xs">
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
          <Typography className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">
            Status
          </Typography>
          <Box
            component="span"
            className={`px-4 py-1.5 font-black text-xs uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${getStatusColor(order.status)}`}
          >
            {order.status}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            className="border-4 border-black dark:border-white/20 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,255,255,0.1)] bg-white dark:bg-[#0a0a0a]"
            sx={{ borderRadius: 0 }}
          >
            <CardContent sx={{ p: 4, "&:last-child": { pb: 4 } }}>
              <Typography
                variant="h5"
                className="font-display font-black uppercase tracking-tighter mb-4 text-black dark:text-white"
              >
                Vibes Included
              </Typography>
              <Divider className="border-black dark:border-white/20 border-[1.5px] mb-6" />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {order.items.map((item) => (
                  <Box
                    key={item.id}
                    className="border-2 border-dashed border-gray-300 dark:border-white/10 p-4"
                    sx={{ display: "flex", gap: 2 }}
                  >
                    <Box
                      sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                    >
                      <Typography className="font-black uppercase text-sm mb-1 text-black dark:text-white">
                        {order.event?.name}
                      </Typography>
                      <Typography className="text-neon-purple dark:text-neon-cyan font-black uppercase text-[10px] tracking-widest">
                        {item.ticketType.name}
                      </Typography>
                      <Typography className="text-gray-500 font-bold mt-2 text-xs">
                        Price: IDR{" "}
                        {Number(item.ticketType.price).toLocaleString("id-ID")}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        textAlign: "right",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                      }}
                    >
                      <Box>
                        <Typography className="font-black text-sm text-black dark:text-white">
                          x {item.quantity}
                        </Typography>
                        <Typography className="font-display font-black text-lg text-black dark:text-white mt-1">
                          IDR{" "}
                          {(
                            Number(item.ticketType.price) * item.quantity
                          ).toLocaleString("id-ID")}
                        </Typography>
                      </Box>
                      {order.status === "PAID" && !isOrganizerView && (
                        <Button
                          size="medium"
                          onClick={() => setIsReviewOpen(true)}
                          className="bg-neon-magenta text-white mt-4"
                          sx={{
                            py: 1,
                            px: 2.5,
                            fontSize: "0.8rem",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            boxShadow: "4px 4px 0 0 #000",
                            border: "2px solid black",
                            borderRadius: 0,
                            "&:hover": {
                              backgroundColor: "#ff008a",
                              transform: "translate(-2px, -2px)",
                              color: "white",
                            },
                            ...(theme) =>
                              theme.palette.mode === "dark" && {
                                boxShadow: "4px 4px 0 0 rgba(255,255,255,0.2)",
                              },
                          }}
                        >
                          Leave a Review
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            className="border-4 border-black dark:border-white/20 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(0,255,255,0.1)] bg-white dark:bg-[#0a0a0a]"
            sx={{ borderRadius: 0 }}
          >
            <CardContent sx={{ p: 4, "&:last-child": { pb: 4 } }}>
              <Typography
                variant="h5"
                className="font-display font-black uppercase tracking-tighter mb-4 text-black dark:text-white"
              >
                Summary
              </Typography>
              <Divider className="border-black dark:border-white/20 border-[1.5px] mb-6" />

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}
              >
                <Box display="flex" justifyContent="space-between">
                  <Typography className="text-gray-500 font-bold uppercase text-xs">
                    Payment Method
                  </Typography>
                  <Typography className="font-black uppercase text-xs text-black dark:text-white">
                    {order.paymentMethod.replace(/_/g, " ")}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography className="text-gray-500 font-bold uppercase text-xs">
                    Original Total
                  </Typography>
                  <Typography className="font-black text-xs text-black dark:text-white">
                    IDR{" "}
                    {Number(order.totalOriginalPrice).toLocaleString("id-ID")}
                  </Typography>
                </Box>
                {order.pointsUsed > 0 && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    className="text-neon-pink"
                  >
                    <Typography className="font-bold uppercase text-xs">
                      Points Used
                    </Typography>
                    <Typography className="font-black text-xs">
                      - IDR {order.pointsUsed.toLocaleString("id-ID")}
                    </Typography>
                  </Box>
                )}
              </Box>

              {order.paymentProofUrl ? (
                <Box className="mb6">
                  <Typography className="text-gray-500 font-bold uppercase text-xs mb-2">
                    Payment Proof
                  </Typography>
                  <Box className="border-2 border-black dark:border-white/20 p-2 bg-gray-50 dark:bg-gray-900 flex justify-center">
                    <img
                      src={order.paymentProofUrl}
                      alt="Payment Proof"
                      className="w-full h-auto max-h-64 object-contain"
                    />
                  </Box>
                </Box>
              ) : (
                order.status === "PENDING" &&
                !isOrganizerView && (
                  <Box className="mb-6 border-4 border-dashed border-black dark:border-white/20 p-4">
                    <Typography className="font-display font-black uppercase text-sm mb-2 text-black dark:text-white">
                      Upload Payment Proof
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setProofFile(e.target.files[0]);
                        }
                      }}
                      className="w-full mb-4 text-xs font-bold p-2 file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:font-black file:bg-neon-cyan file:text-black hover:file:bg-black hover:file:text-neon-cyan transition-colors dark:text-gray-300"
                    />
                    <Button
                      fullWidth
                      disabled={!proofFile || uploadProofMutation.isPending}
                      onClick={handleUploadProof}
                      className="bg-black text-white dark:bg-white dark:text-black"
                      sx={{
                        py: 1.5,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        borderRadius: 0,
                        border: "2px solid",
                        borderColor: "black",
                        "&:hover": {
                          transform: "translate(-2px, -2px)",
                          boxShadow: "4px 4px 0 0 #ee2b8c",
                        },
                        "&.Mui-disabled": {
                          opacity: 0.5,
                        },
                        transition: "all 0.2s",
                      }}
                    >
                      {uploadProofMutation.isPending
                        ? "Uploading..."
                        : "Submit Proof"}
                    </Button>
                  </Box>
                )
              )}

              <Divider className="border-black dark:border-white/20 border-t-2 border-dashed mb-6" />

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-end"
                mb={4}
              >
                <Typography className="font-black uppercase text-sm text-black dark:text-white">
                  Grand Total
                </Typography>
                <Typography className="font-display font-black text-2xl text-neon-purple dark:text-neon-cyan tracking-tighter">
                  IDR {Number(order.totalFinalPrice).toLocaleString("id-ID")}
                </Typography>
              </Box>

              {order.status === "PENDING" && isOrganizerView && (
                <Button
                  fullWidth
                  onClick={onPay}
                  disabled={isPaying}
                  className="bg-neon-cyan text-black"
                  sx={{
                    py: 2,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    boxShadow: "6px 6px 0 0 #000",
                    border: "2px solid black",
                    borderRadius: 0,
                    "&:hover": {
                      backgroundColor: "#00e5ff",
                      transform: "translate(-2px, -2px)",
                    },
                    "&.Mui-disabled": {
                      opacity: 0.5,
                      backgroundColor: "#00e5ff",
                      color: "black",
                    },
                    transition: "all 0.2s",
                    ...(theme) =>
                      theme.palette.mode === "dark" && {
                        boxShadow: "6px 6px 0 0 rgba(255,255,255,0.2)",
                      },
                  }}
                >
                  {isPaying ? "Processing..." : "Confirm Payment"}
                </Button>
              )}
              {order.status === "PENDING" &&
                !isOrganizerView &&
                order.paymentProofUrl && (
                  <Box className="w-full py-4 bg-yellow-400 text-black font-black uppercase tracking-widest text-center border-4 border-black dark:border-white">
                    Waiting for Organizer Confirmation
                  </Box>
                )}
              {order.status === "PENDING" &&
                !isOrganizerView &&
                !order.paymentProofUrl && (
                  <Box className="w-full py-4 bg-red-400 text-white font-black uppercase tracking-widest text-center border-4 border-black dark:border-white">
                    Payment Proof Required
                  </Box>
                )}
              {order.status === "PAID" && (
                <Box className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-center border-4 border-black dark:border-white">
                  Payment Successful
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
