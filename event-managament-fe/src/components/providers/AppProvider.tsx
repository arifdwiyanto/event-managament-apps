"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThemeProvider as HypeThemeProvider,
  FloatingThemeToggle,
} from "@/features/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ee2b8c", // Hype Primary Pink
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#221019", // Background Dark
    },
    background: {
      default: "#f8f6f7", // Background Light
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 16, // 1rem
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Spline Sans, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "9999px", // Full rounded buttons like in design
          padding: "12px 24px",
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "9999px", // Full rounded inputs
            "& fieldset": {
              borderColor: "#e6dbe0",
            },
          },
        },
      },
    },
  },
});

export default function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HypeThemeProvider>
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <GoogleOAuthProvider
                  clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
                >
                  {children}
                </GoogleOAuthProvider>
              </motion.div>
            </AnimatePresence>
            <FloatingThemeToggle />
          </HypeThemeProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </QueryClientProvider>
  );
}
