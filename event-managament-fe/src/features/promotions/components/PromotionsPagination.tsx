import { Box, Typography, TablePagination, IconButton } from "@mui/material";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface PromotionsPaginationProps {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const PromotionsPagination = ({
  total,
  page,
  limit,
  totalPages,
  onPageChange,
}: PromotionsPaginationProps) => {
  if (totalPages <= 1) return null;

  const handleChangePage = (_: any, newPage: number) => {
    onPageChange(newPage + 1);
  };

  return (
    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
      {/* Desktop Pagination */}
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        rowsPerPageOptions={[limit]}
        sx={{
          display: { xs: "none", md: "block" },
          borderTop: "none",
          "& .MuiTablePagination-toolbar": { pl: 0 },
        }}
      />

      {/* Mobile Pagination */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </IconButton>
        <Typography variant="body2" fontWeight="bold">
          Page {page} of {totalPages}
        </Typography>
        <IconButton
          disabled={page === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PromotionsPagination;
