"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThemeProvider as HypeThemeProvider,
  FloatingThemeToggle,
  useThemeStore,
} from "@/features/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function AppProvider({ children }: { children: ReactNode }) {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  
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

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedTheme,
          primary: {
            main: "#ee2b8c", // Hype Primary Pink
            contrastText: "#ffffff",
          },
          secondary: {
            main: resolvedTheme === "dark" ? "#221019" : "#221019",
          },
          background: {
            default: resolvedTheme === "dark" ? "#1a0c13" : "#f8f6f7", // Dashboard content bg
            paper: resolvedTheme === "dark" ? "#221019" : "#ffffff", // Dashboard sidebar/header bg
          },
          divider: resolvedTheme === "dark" ? "#3a1d2e" : "#e6dbe0",
          text: {
            primary: resolvedTheme === "dark" ? "#ffffff" : "#181114",
            secondary: resolvedTheme === "dark" ? "#896175" : "#5f4351",
          },
        },
        shape: {
          borderRadius: 16,
        },
        typography: {
          fontFamily: "var(--font-geist-sans), Spline Sans, sans-serif",
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none", // Remove MUI's default dark mode elevation overlay
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: "9999px",
                padding: "12px 24px",
                fontWeight: 700,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9999px",
                  "& fieldset": {
                    borderColor: resolvedTheme === "dark" ? "#3a1d2e" : "#e6dbe0",
                  },
                  "&:hover fieldset": {
                    borderColor: resolvedTheme === "dark" ? "#ee2b8c80" : "#ee2b8c80",
                  },
                },
              },
            },
          },
        },
      }),
    [resolvedTheme]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <HypeThemeProvider>
            <AnimatePresence mode="wait">
              <motion.div
                key={resolvedTheme} // Force re-render on theme change
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
