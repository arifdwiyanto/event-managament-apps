"use client";

import React from "react";
import { useTicketSelectionModal } from "../hooks";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton,
  Typography,
  Box
} from "@mui/material";
import { XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Event } from "../types/event.types";
import TicketSelectionCard from "./TicketSelectionCard";

interface TicketSelectionModalProps {
  open: boolean;
  onClose: () => void;
  event: Event;
  onToast: (message: string, severity: "success" | "error") => void;
}

const TicketSelectionModal: React.FC<TicketSelectionModalProps> = ({ 
  open, 
  onClose, 
  event,
  onToast 
}) => {
  const {
    theme,
    isMobile,
    quantities,
    handleUpdateQuantity,
    selectedTickets,
    total,
    cartLoading,
    handleAddToCart,
  } = useTicketSelectionModal({ event, onClose, onToast });

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? "24px 24px 0 0" : "24px",
          background: theme.palette.mode === 'dark' ? "rgba(19, 19, 19, 0.95)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          border: theme.palette.mode === 'dark' ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: theme.palette.mode === 'dark' ? "0 20px 50px rgba(0,0,0,0.8)" : "0 20px 50px rgba(0,0,0,0.1)",
          ...(isMobile && {
            height: 'auto',
            maxHeight: '85vh',
            marginTop: 'auto',
          })
        }
      }}
      sx={{
        ...(isMobile && {
          "& .MuiDialog-container": {
            alignItems: "flex-end",
          },
        }),
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(4px)",
          backgroundColor: theme.palette.mode === 'dark' ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)"
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 3, 
        borderBottom: theme.palette.mode === 'dark' ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Box>
          <Typography className={`font-display font-black uppercase tracking-widest text-lg leading-none mb-1 ${theme.palette.mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Select Tickets
          </Typography>
          <Typography className="text-[10px] text-neon-cyan font-bold uppercase tracking-widest">
            {event.title}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ 
            color: theme.palette.mode === 'dark' ? "white" : "black", 
            p: 1,
            bgcolor: theme.palette.mode === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            "&:hover": { bgcolor: theme.palette.mode === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }
          }}
        >
          <XMarkIcon className="size-5" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, mt: 1 }}>
        <Box className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
          {(event.ticketTypes || []).map((ticket) => (
            <TicketSelectionCard
              key={ticket.id}
              ticket={ticket}
              quantity={quantities[ticket.id] || 0}
              onIncrease={() => handleUpdateQuantity(ticket.id, 1)}
              onDecrease={() => handleUpdateQuantity(ticket.id, -1)}
            />
          ))}
          {(!event.ticketTypes || event.ticketTypes.length === 0) && (
            <Typography className={`font-bold uppercase text-center py-8 text-xs tracking-widest ${theme.palette.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              No tickets available
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: theme.palette.mode === 'dark' ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)", display: "block", bgcolor: theme.palette.mode === 'dark' ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.02)" }}>
        <Box className="flex justify-between items-center mb-4">
          <Typography className={`font-bold uppercase text-[10px] tracking-widest ${theme.palette.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Total Amount
          </Typography>
          <Typography className={`font-black text-xl tracking-tighter italic ${theme.palette.mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            IDR {(total / 1000).toFixed(0)}K
          </Typography>
        </Box>
        <button 
          disabled={selectedTickets.length === 0 || cartLoading}
          onClick={handleAddToCart}
          className="relative w-full py-4 rounded-xl bg-neon-cyan text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
        >
          <ShoppingCartIcon className="size-4 md:size-5" strokeWidth={2.5} />
          {cartLoading ? "Processing..." : "Confirm & Add to Cart"}
          
          {/* Button Glow */}
          <div className="absolute inset-0 bg-neon-cyan/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketSelectionModal;
