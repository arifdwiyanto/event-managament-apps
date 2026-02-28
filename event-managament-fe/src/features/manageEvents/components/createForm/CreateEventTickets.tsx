import { PlusIcon, TicketIcon } from "@heroicons/react/24/outline";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

export interface TicketTier {
  id: string;
  name: string;
  quantity: string;
  price: string;
  description: string;
}

interface ICreateEventTicketsProps {
  tickets: TicketTier[];
  setTickets: React.Dispatch<React.SetStateAction<TicketTier[]>>;
}

const CreateEventTickets: React.FC<ICreateEventTicketsProps> = ({
  tickets,
  setTickets,
}) => {
  const addTicketTier = () => {
    setTickets([
      ...tickets,
      {
        id: Date.now().toString(),
        name: "",
        quantity: "",
        price: "",
        description: "",
      },
    ]);
  };
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TicketIcon className="w-6 h-6 text-[#ee2b8c]" />
          <Typography variant="h6" fontWeight="bold">
            Tickets
          </Typography>
        </Box>
        <Button
          onClick={addTicketTier}
          startIcon={<PlusIcon className="w-4 h-4" />}
          sx={{ color: "#ee2b8c", fontWeight: "bold", borderRadius: 1 }}
        >
          Add Tier
        </Button>
      </Box>

      <Stack spacing={3}>
        {tickets.map((ticket, index) => (
          <Paper
            key={ticket.id}
            variant="outlined"
            sx={{ p: 3, borderRadius: 1 }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "5fr 3fr 4fr" },
                gap: 2,
                mb: 2,
              }}
            >
              {/* Ticket Name */}
              <Box>
                <Typography
                  variant="overline"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  Ticket Name
                </Typography>
                <TextField
                  fullWidth
                  value={ticket.name}
                  onChange={(e) =>
                    setTickets(
                      tickets.map((t) =>
                        t.id === ticket.id ? { ...t, name: e.target.value } : t,
                      ),
                    )
                  }
                  placeholder="e.g. VIP Pass"
                  variant="outlined"
                  size="small"
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: 0.5,
                        "& fieldset": {
                          borderRadius: 0.5,
                        },
                      },
                    },
                  }}
                />
              </Box>

              {/* Quantity */}
              <Box>
                <Typography
                  variant="overline"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  Quantity
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={ticket.quantity}
                  onChange={(e) =>
                    setTickets(
                      tickets.map((t) =>
                        t.id === ticket.id
                          ? { ...t, quantity: e.target.value }
                          : t,
                      ),
                    )
                  }
                  placeholder="0"
                  variant="outlined"
                  size="small"
                  slotProps={{
                    input: {
                      sx: {
                        borderRadius: 0.5,
                        "& fieldset": {
                          borderRadius: 0.5,
                        },
                      },
                    },
                  }}
                />
              </Box>

              {/* Price */}
              <Box>
                <Typography
                  variant="overline"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  Price (IDR)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={ticket.price}
                  onChange={(e) =>
                    setTickets(
                      tickets.map((t) =>
                        t.id === ticket.id
                          ? { ...t, price: e.target.value }
                          : t,
                      ),
                    )
                  }
                  placeholder="0"
                  variant="outlined"
                  size="small"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">Rp</InputAdornment>
                      ),
                      sx: {
                        borderRadius: 0.5,
                        "& fieldset": {
                          borderRadius: 0.5,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            {/* Description */}
            <Box>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={ticket.description}
                onChange={(e) =>
                  setTickets(
                    tickets.map((t) =>
                      t.id === ticket.id
                        ? { ...t, description: e.target.value }
                        : t,
                    ),
                  )
                }
                placeholder="Description"
                variant="outlined"
                size="small"
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: 0.5,
                      "& fieldset": {
                        borderRadius: 0.5,
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        ))}

        <Button
          onClick={addTicketTier}
          variant="outlined"
          startIcon={<PlusIcon className="w-5 h-5" />}
          sx={{
            py: 2,
            borderStyle: "dashed",
            borderWidth: 2,
            borderRadius: 1,
            color: "text.secondary",
            borderColor: "divider",
            "&:hover": {
              borderColor: "#ee2b8c",
              color: "#ee2b8c",
              bgcolor: "rgba(238, 43, 140, 0.05)",
            },
          }}
        >
          Add another ticket type
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateEventTickets;
