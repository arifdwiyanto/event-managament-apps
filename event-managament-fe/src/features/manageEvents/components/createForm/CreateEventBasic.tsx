import { Category } from "@/features/events/types/event.types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Box, Chip, Paper, Stack, TextField, Typography, FormHelperText } from "@mui/material";
import * as React from "react";
import { FormikProps } from "formik";

interface ICreateEventBasicsProps {
  formik: FormikProps<any>;
  categories: Category[];
}

const CreateEventBasics: React.FC<ICreateEventBasicsProps> = ({
  formik,
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
            Event Name *
          </Typography>
          <TextField
            fullWidth
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && typeof formik.errors.name === 'string' ? formik.errors.name : ''}
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
            Category *
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                onClick={() => formik.setFieldValue("categoryId", cat.id)}
                sx={{
                  fontWeight: "bold",
                  borderRadius: 0.5,
                  ...(formik.values.categoryId === cat.id
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
          {formik.touched.categoryId && formik.errors.categoryId && (
            <FormHelperText sx={{ color: "error.main", mt: 1 }}>
              {typeof formik.errors.categoryId === 'string' ? formik.errors.categoryId : ''}
            </FormHelperText>
          )}
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
            sx={{ 
              borderRadius: 1, 
              overflow: "hidden",
              borderColor: formik.touched.description && formik.errors.description ? "#d32f2f" : "inherit",
            }}
          >
            {/* Textarea */}
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
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
          {formik.touched.description && formik.errors.description && (
            <FormHelperText sx={{ color: "error.main", mt: 1 }}>
              {typeof formik.errors.description === 'string' ? formik.errors.description : ''}
            </FormHelperText>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default CreateEventBasics;
