import React, { useState } from "react";
import { useCreateReview } from "../hooks/useReviews";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

interface IReviewModalProps {
  open: boolean;
  onClose: () => void;
  transactionItemId: string;
}

const ReviewModal: React.FC<IReviewModalProps> = ({
  open,
  onClose,
  transactionItemId,
}) => {
  const [rating, setRating] = useState<number | null>(0);
  const [feedback, setFeedback] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as any,
  });

  const createReviewMutation = useCreateReview({
    onSuccess: () => {
      setToast({
        open: true,
        message: "Review submitted successfully!",
        severity: "success",
      });
      setTimeout(() => {
        onClose();
        setRating(0);
        setFeedback("");
      }, 500);
    },
    onError: (error: any) => {
      setToast({
        open: true,
        message: error.response?.data?.message || "Failed to submit review",
        severity: "error",
      });
    },
  });

  const handleSubmit = async () => {
    if (!rating) return;
    createReviewMutation.mutate({
      rating,
      feedback,
      transactionItemId,
    });
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Leave a Review</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="event-rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
          />
        </Box>
        <TextField
          label="Feedback (optional)"
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          fullWidth
          placeholder="Tell us about your experience..."
          sx={{
            mt: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{mr: 2, mb: 2}}>
        <Button onClick={onClose} disabled={createReviewMutation.isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!rating || createReviewMutation.isPending}
          startIcon={
            createReviewMutation.isPending ? (
              <CircularProgress size={20} />
            ) : null
          }
        >
          Submit Review
        </Button>
      </DialogActions>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "12px", mt: 6 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ReviewModal;
