"use client";

import React from "react";
import { Drawer, IconButton, Typography, Divider, Box, Button } from "@mui/material";
import { XMarkIcon, ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCartDrawer } from "../hooks/useCartDrawer";
import { groupCartItemsByOrganizer } from "../utils/groupItems";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { 
    cart,
    updateItemQuantity, 
    removeItem, 
    total, 
    sortedItems 
  } = useCartDrawer(open);

  const router = useRouter();

  const handleCheckout = ()=>{
    onClose();
    router.push("/user/checkout");
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          bgcolor: "background.default",
          borderLeft: "4px solid black",
          boxShadow: "-10px 0px 30px rgba(0,0,0,0.1)",
          "&.dark": {
            borderLeft: "4px solid var(--neon-cyan)",
          }
        }
      }}
    >
      <Box className="flex flex-col h-full bg-white dark:bg-black p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-neon-cyan border-4 border-black dark:border-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              <ShoppingCartIcon className="size-6 text-black" />
            </div>
            <Typography className="font-display font-black uppercase text-2xl tracking-tighter text-black dark:text-white">
              Your Cart
            </Typography>
          </div>
          <button 
            onClick={onClose} 
            className="group flex items-center justify-center size-10 rounded-none border-2 border-black dark:border-neon-cyan bg-white dark:bg-black hover:bg-black dark:hover:bg-neon-cyan transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,255,255,0.3)] active:translate-x-0.5 active:translate-y-0.5"
          >
            <XMarkIcon className="size-6 text-black dark:text-neon-cyan group-hover:text-white dark:group-hover:text-black transition-colors" strokeWidth={2.5} />
          </button>
        </div>

        <Divider className="border-[1.5px] border-black dark:border-white/10 mb-6" />

        {/* Cart Items Grouped by Organizer */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
          {sortedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400 font-bold uppercase italic text-center">
              <p className="tracking-tighter text-lg">Your vibe is empty</p>
              <Button onClick={onClose} className="mt-4 text-neon-purple dark:text-neon-cyan font-black hover:underline tracking-widest text-xs">
                EXPLORE EVENTS
              </Button>
            </div>
          ) : (
            groupCartItemsByOrganizer(sortedItems).map((group) => (
              <div key={group.organizerId} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-[2px] flex-1 bg-black/10 dark:bg-white/10"></div>
                  <Typography className="font-display font-black uppercase text-[10px] tracking-widest text-neon-purple dark:text-neon-cyan whitespace-nowrap">
                    EO: {group.organizerName}
                  </Typography>
                  <div className="h-[2px] flex-1 bg-black/10 dark:bg-white/10"></div>
                </div>
                
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div key={item.id} className="border-4 border-black dark:border-white/10 p-3 bg-white dark:bg-[#0a0a0a] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,255,255,0.05)] flex gap-4 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(0,255,255,0.1)]">
                      <div className="relative size-20 border-2 border-black dark:border-white/20 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.ticketType.event.imageUrl || "/placeholder.jpg"}
                          alt={item.ticketType.event.name}
                          className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 border-[8px] border-white/10 pointer-events-none"></div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <Typography className="font-display font-black uppercase text-[13px] leading-none mb-1 text-black dark:text-white truncate">
                            {item.ticketType.event.name}
                          </Typography>
                          <Typography className="text-[10px] font-black text-neon-pink dark:text-neon-pink/80 uppercase tracking-widest leading-none">
                            {item.ticketType.name}
                          </Typography>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border-[2px] border-black dark:border-white/20 bg-gray-50 dark:bg-black">
                            <button
                              onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-black text-xs transition-colors"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x-[2px] border-black dark:border-white/20 font-black text-xs min-w-[32px] text-center dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-black text-xs transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)} 
                            className="p-1.5 text-black/40 dark:text-white/40 hover:text-neon-pink dark:hover:text-neon-pink transition-colors"
                          >
                            <TrashIcon className="size-4" strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="mt-8 pt-8 border-t-4 border-black dark:border-white/10 border-dashed">
            <div className="flex justify-between items-end mb-8">
              <div>
                <Typography className="font-bold uppercase text-[10px] tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                  Subtotal
                </Typography>
                <Typography className="font-display font-black text-sm text-black dark:text-white">
                  {cart.items.length} {cart.items.length === 1 ? 'VIBE' : 'VIBES'}
                </Typography>
              </div>
              <Typography className="font-display font-black text-3xl tracking-tighter uppercase text-black dark:text-white italic">
                IDR {(total / 1000000).toFixed(2)}M
              </Typography>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-5 bg-black dark:bg-neon-purple text-white dark:text-white font-black text-sm uppercase tracking-[0.2em] shadow-[6px_6px_0_0_#ee2b8c] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_#ee2b8c] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-200"
            >
              Checkout Vibe
            </button>
          </div>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
