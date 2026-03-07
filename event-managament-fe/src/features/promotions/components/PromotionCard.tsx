import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Promotion } from "../types/promotions.types";

interface PromotionCardProps {
  promo: Promotion;
  index: number;
  page: number;
  limit: number;
  onEdit: (promo: Promotion) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const PromotionCard = ({
  promo,
  index,
  page,
  limit,
  onEdit,
  onDelete,
  isDeleting,
}: PromotionCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 0.5 }}>
            <Box component="span" sx={{ color: "primary.main", mr: 1 }}>
              #{(page - 1) * limit + index + 1}
            </Box>
            {promo.name}
          </Typography>
          <Chip
            label={promo.code}
            size="small"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              fontWeight: "900",
              fontFamily: "monospace",
              borderRadius: 1,
              fontSize: "0.6rem",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => onEdit(promo)}
            size="small"
            sx={{ bgcolor: "action.hover" }}
          >
            <PencilSquareIcon className="w-4 h-4" />
          </IconButton>
          <IconButton
            onClick={() => onDelete(promo.id)}
            disabled={isDeleting}
            size="small"
            color="error"
            sx={{ bgcolor: "action.hover" }}
          >
            <TrashIcon className="w-4 h-4" />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 1 }}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight="700"
            sx={{ display: "block", mb: 0.5 }}
          >
            DISCOUNT
          </Typography>
          <Typography variant="body2" fontWeight="800" color="success.main">
            {promo.discountPercentage
              ? `${promo.discountPercentage}% OFF`
              : `Rp ${Number(promo.discountAmount).toLocaleString("id-ID")}`}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight="700"
            sx={{ display: "block", mb: 0.5 }}
          >
            USAGE
          </Typography>
          <Typography variant="body2" fontWeight="800">
            {promo._count?.transactions || 0} / {promo.maxUsage || "∞"}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ pt: 2, mt: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight="600"
          sx={{ display: "block" }}
        >
          Target:{" "}
          <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>
            {promo.events?.[0]?.event?.name || "All Events"}
          </Box>
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight="600"
          sx={{ display: "block", mt: 0.5 }}
        >
          Validity:{" "}
          <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>
            {new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "short",
            }).format(new Date(promo.startDate))}{" "}
            -{" "}
            {new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "short",
            }).format(new Date(promo.endDate))}
          </Box>
        </Typography>
      </Box>
    </Paper>
  );
};

export default PromotionCard;
