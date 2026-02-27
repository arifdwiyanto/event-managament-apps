import { Category } from "@/features/events/types/event.types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Box, Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import * as React from "react";

interface ICreateEventBasicsProps {
  name: string;
  setName: (val: string) => void;
  categoryId: string;
  setCategoryId: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  categories: Category[];
}

const CreateEventBasics: React.FC<ICreateEventBasicsProps> = ({
  name,
  setName,
  categoryId,
  setCategoryId,
  description,
  setDescription,
  categories,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <PencilSquareIcon className="w-6 h-6 text-[#ee2b8c]" />
        <Typography variant="h6" fontWeight="bold">
          The Basics
        </Typography>
      </Box>

      <Stack spacing={4}>
        {/* Event Name */}
        <Box>
          <Typography
            variant="overline"
            fontWeight="bold"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Event Name
          </Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Vibes Festival 2024"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "background.paper",
              },
            }}
          />
        </Box>

        {/* Category */}
        <Box>
          <Typography
            variant="overline"
            fontWeight="bold"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Category
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                onClick={() => setCategoryId(cat.id)}
                sx={{
                  fontWeight: "bold",
                  borderRadius: 0.5,
                  ...(categoryId === cat.id
                    ? {
                        bgcolor: "#ee2b8c",
                        color: "white",
                        "&:hover": { bgcolor: "#d6197b" },
                      }
                    : {}),
                }}
              />
            ))}
          </Stack>
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
          <Paper
            variant="outlined"
            sx={{ borderRadius: 1, overflow: "hidden" }}
          >
            {/* Textarea */}
            <TextField
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people what makes your event special..."
              variant="standard"
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: { p: 2 },
                },
              }}
            />
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
};

export default CreateEventBasics;
