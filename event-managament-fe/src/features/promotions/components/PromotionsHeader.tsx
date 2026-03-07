import { Box, Typography, Button } from "@mui/material";
import { PlusIcon } from "@heroicons/react/24/outline";

interface PromotionsHeaderProps {
  onCreateClick: () => void;
}

const PromotionsHeader = ({ onCreateClick }: PromotionsHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        mb: 4,
      }}
    >
      <Box>
        <Typography
          variant="h5"
          fontWeight="900"
          gutterBottom
          sx={{ fontFamily: "inherit" }}
        >
          Promotions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your discount codes and vouchers
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={onCreateClick}
        startIcon={<PlusIcon className="w-5 h-5" />}
        sx={{
          bgcolor: "#ee2b8c",
          "&:hover": { bgcolor: "#d42279" },
          fontWeight: "bold",
          borderRadius: 2,
          textTransform: "none",
          px: 3,
          py: 1,
        }}
      >
        Create Promotion
      </Button>
    </Box>
  );
};

export default PromotionsHeader;
