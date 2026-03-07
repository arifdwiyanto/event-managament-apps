"use client";

import React from "react";
import { Typography, Divider } from "@mui/material";
import { PaymentMethod as PaymentMethodType } from "../types/checkout.types";

interface PaymentMethodProps {
  methods: PaymentMethodType[];
  selectedPayment: string;
  onSelect: (id: string) => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({ methods, selectedPayment, onSelect }) => {
  return (
    <div className="border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] bg-white dark:bg-[#0a0a0a]">
      <Typography
        variant="h5"
        className="font-display font-black uppercase mb-4 text-black dark:text-white"
      >
        Payment Method
      </Typography>
      <Divider className="border-black dark:border-white/20 border-[1.5px] mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((method) => (
          <div
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`border-2 p-4 cursor-pointer transition-all ${
              selectedPayment === method.id
                ? "border-neon-purple shadow-[4px_4px_0_0_var(--neon-purple)]"
                : "border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white"
            }`}
          >
            <Typography
              className={`font-black uppercase text-sm ${selectedPayment === method.id ? "text-neon-purple" : "text-black dark:text-gray-400"}`}
            >
              {method.label}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};
