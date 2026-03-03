import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";
import {
  Box,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import { FormikProps } from "formik";

interface ICreateEventDateTimeLocationProps {
  formik: FormikProps<any>;
}

const CreateEventDateTimeLocation: React.FC<
  ICreateEventDateTimeLocationProps
> = ({ formik }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <CalendarDaysIcon className="w-6 h-6 text-[#ee2b8c]" />
        <Typography variant="h6" fontWeight="bold">
          When & Where
        </Typography>
      </Box>

      <Stack spacing={4}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {/* Start Date */}
          <Box>
            <Typography
              variant="overline"
              fontWeight="bold"
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              Starts *
            </Typography>
            <TextField
              fullWidth
              name="startDate"
              type="datetime-local"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startDate && Boolean(formik.errors.startDate)}
              helperText={formik.touched.startDate && typeof formik.errors.startDate === 'string' ? formik.errors.startDate : ''}
              variant="outlined"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  bgcolor: "background.paper",
                },
              }}
            />
          </Box>

          {/* End Date */}
          <Box>
            <Typography
              variant="overline"
              fontWeight="bold"
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              Ends *
            </Typography>
            <TextField
              fullWidth
              name="endDate"
              type="datetime-local"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={formik.touched.endDate && typeof formik.errors.endDate === 'string' ? formik.errors.endDate : ''}
              variant="outlined"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  bgcolor: "background.paper",
                },
              }}
            />
          </Box>
        </Box>

        {/* Location */}
        <Box>
          <Typography
            variant="overline"
            fontWeight="bold"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Location *
          </Typography>
          <TextField
            fullWidth
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && typeof formik.errors.location === 'string' ? formik.errors.location : ''}
            placeholder="Location"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "background.paper",
              },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default CreateEventDateTimeLocation;
