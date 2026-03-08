import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import { useOrgRole } from "@/hooks/useOrgRole";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Promotion } from "../types/promotions.types";

interface PromotionsTableProps {
  promotions: Promotion[];
  page: number;
  limit: number;
  onEdit: (promo: Promotion) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const PromotionsTable = ({
  promotions,
  page,
  limit,
  onEdit,
  onDelete,
  isDeleting,
}: PromotionsTableProps) => {
  const role = useOrgRole();
  const isEditable = role === "OWNER";

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        display: { xs: "none", md: "block" },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="promotions table">
        <TableHead sx={{ bgcolor: "action.hover" }}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "800", color: "text.primary", py: 2, width: 50 }}
            >
              #
            </TableCell>
            <TableCell sx={{ fontWeight: "800", color: "text.primary", py: 2 }}>
              Promotion
            </TableCell>
            <TableCell sx={{ fontWeight: "800", color: "text.primary" }}>
              Target Event
            </TableCell>
            <TableCell sx={{ fontWeight: "800", color: "text.primary" }}>
              Discount
            </TableCell>
            <TableCell sx={{ fontWeight: "800", color: "text.primary" }}>
              Usage
            </TableCell>
            <TableCell sx={{ fontWeight: "800", color: "text.primary" }}>
              Validity
            </TableCell>
            {isEditable && (
              <TableCell
                align="right"
                sx={{ fontWeight: "800", color: "text.primary" }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {promotions.map((promo, index) => (
            <TableRow
              key={promo.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { bgcolor: "action.hover" },
                transition: "background-color 0.2s",
              }}
            >
              <TableCell
                sx={{ py: 2.5, fontWeight: "700", color: "text.secondary" }}
              >
                {(page - 1) * limit + index + 1}
              </TableCell>
              <TableCell sx={{ py: 2.5 }}>
                <Typography variant="subtitle2" fontWeight="800">
                  {promo.name}
                </Typography>
                <Chip
                  label={promo.code}
                  size="small"
                  sx={{
                    mt: 1,
                    bgcolor: "primary.main",
                    color: "white",
                    fontWeight: "900",
                    fontFamily: "monospace",
                    borderRadius: 1,
                    fontSize: "0.65rem",
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="600"
                >
                  {promo.events?.[0]?.event?.name || "All Events"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  fontWeight="800"
                  color="success.main"
                >
                  {promo.discountPercentage
                    ? `${promo.discountPercentage}% OFF`
                    : `Rp ${Number(promo.discountAmount).toLocaleString("id-ID")}`}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.primary" fontWeight="700">
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 0.5 }}
                  >
                {promo.maxUsage || "∞"}
                  </Typography>
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, display: "block" }}
                >
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "short",
                  }).format(new Date(promo.startDate))} -{" "}
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "short",
                  }).format(new Date(promo.endDate))}
                </Typography>
              </TableCell>
              {isEditable && (
                <TableCell align="right">
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                  >
                    <IconButton
                      onClick={() => onEdit(promo)}
                      size="small"
                      sx={{
                        bgcolor: "action.hover",
                        "&:hover": { bgcolor: "primary.main", color: "white" },
                      }}
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete(promo.id)}
                      disabled={isDeleting}
                      size="small"
                      color="error"
                      sx={{
                        bgcolor: "action.hover",
                        "&:hover": { bgcolor: "error.main", color: "white" },
                      }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </IconButton>
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PromotionsTable;
