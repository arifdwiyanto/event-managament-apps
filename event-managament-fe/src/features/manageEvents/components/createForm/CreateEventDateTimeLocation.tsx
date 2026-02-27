import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";
import {
  Box,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface ICreateEventDateTimeLocationProps {
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
}

const CreateEventDateTimeLocation: React.FC<
  ICreateEventDateTimeLocationProps
> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  location,
  setLocation,
}) => {
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
              Starts
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              Ends
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
            Location
          </Typography>
          <TextField
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
