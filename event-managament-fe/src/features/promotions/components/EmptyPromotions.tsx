import { Box, Typography, Button } from "@mui/material";
import { TagIcon } from "@heroicons/react/24/outline";

interface EmptyPromotionsProps {
  onCreateClick: () => void;
}

const EmptyPromotions = ({ onCreateClick }: EmptyPromotionsProps) => {
  return (
    <Box
      sx={{
        py: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        border: "2px dashed",
        borderColor: "divider",
        borderRadius: 4,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          color: "text.secondary",
        }}
      >
        <TagIcon className="w-8 h-8" />
      </Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        No promotions yet
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 350, mb: 3 }}
      >
        Create your first discount code to help boost your event sales and
        attract more attendees.
      </Typography>
      <Button
        onClick={onCreateClick}
        sx={{
          color: "#ee2b8c",
          fontWeight: "bold",
          textTransform: "none",
        }}
      >
        + Create your first promo
      </Button>
    </Box>
  );
};

export default EmptyPromotions;
