import { PlusIcon, TicketIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  IconButton,
} from "@mui/material";
import React from "react";
import { FormikProps } from "formik";

export interface TicketTier {
  id: string;
  name: string;
  quantity: string;
  price: string;
  description: string;
}

interface ICreateEventTicketsProps {
  formik: FormikProps<any>;
}

const CreateEventTickets: React.FC<ICreateEventTicketsProps> = ({
  formik,
}) => {
  const addTicketTier = () => {
    formik.setFieldValue("tickets", [
      ...formik.values.tickets,
      {
        id: Date.now().toString(),
        name: "",
        quantity: "",
        price: "",
        description: "",
      },
    ]);
  };

  const removeTicketTier = (ticketId: string) => {
    formik.setFieldValue(
      "tickets",
      formik.values.tickets.filter((t: TicketTier) => t.id !== ticketId),
    );
  };

  const handleTicketFieldChange = (
    ticketId: string,
    fieldName: string,
    value: string,
  ) => {
    formik.setFieldValue(
      "tickets",
      formik.values.tickets.map((t: TicketTier) =>
        t.id === ticketId ? { ...t, [fieldName]: value } : t,
      ),
    );
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
        {formik.values.tickets.map((ticket: TicketTier, index: number) => {
          const ticketErrors = (formik.errors.tickets as any)?.[index] as Record<string, string> | undefined;
          const ticketTouched = (formik.touched.tickets as any)?.[index] as Record<string, boolean> | undefined;

          return (
            <Paper
              key={ticket.id}
              variant="outlined"
              sx={{ p: 3, borderRadius: 1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  Ticket Tier {index + 1}
                </Typography>
                {formik.values.tickets.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => removeTicketTier(ticket.id)}
                    sx={{ color: "error.main" }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </IconButton>
                )}
              </Box>
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
                    Ticket Name *
                  </Typography>
                  <TextField
                    fullWidth
                    value={ticket.name}
                    onChange={(e) =>
                      handleTicketFieldChange(ticket.id, "name", e.target.value)
                    }
                    onBlur={(e) =>
                      formik.setFieldTouched(`tickets.${index}.name`, true)
                    }
                    error={
                      ticketTouched?.name && Boolean(ticketErrors?.name)
                    }
                    helperText={ticketTouched?.name && typeof ticketErrors?.name === 'string' ? ticketErrors.name : ''}
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
                    Quantity *
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={ticket.quantity}
                    onChange={(e) =>
                      handleTicketFieldChange(
                        ticket.id,
                        "quantity",
                        e.target.value,
                      )
                    }
                    onBlur={(e) =>
                      formik.setFieldTouched(`tickets.${index}.quantity`, true)
                    }
                    error={
                      ticketTouched?.quantity &&
                      Boolean(ticketErrors?.quantity)
                    }
                    helperText={
                      ticketTouched?.quantity && typeof ticketErrors?.quantity === 'string' ? ticketErrors.quantity : ''
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
                    Price (IDR) *
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={ticket.price}
                    onChange={(e) =>
                      handleTicketFieldChange(ticket.id, "price", e.target.value)
                    }
                    onBlur={(e) =>
                      formik.setFieldTouched(`tickets.${index}.price`, true)
                    }
                    error={
                      ticketTouched?.price && Boolean(ticketErrors?.price)
                    }
                    helperText={ticketTouched?.price && typeof ticketErrors?.price === 'string' ? ticketErrors.price : ''}
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
                <Typography
                  variant="overline"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={ticket.description}
                  onChange={(e) =>
                    handleTicketFieldChange(
                      ticket.id,
                      "description",
                      e.target.value,
                    )
                  }
                  onBlur={(e) =>
                    formik.setFieldTouched(`tickets.${index}.description`, true)
                  }
                  error={
                    ticketTouched?.description &&
                    Boolean(ticketErrors?.description)
                  }
                  helperText={
                    ticketTouched?.description && typeof ticketErrors?.description === 'string' ? ticketErrors.description : ''
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
          );
        })}

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
