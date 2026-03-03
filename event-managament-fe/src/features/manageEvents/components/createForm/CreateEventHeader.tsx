import { BoltIcon } from "@heroicons/react/24/outline";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import * as React from "react";

interface ICreateEventHeaderProps {
  onSaveDraft?: () => void;
  onCancel?: () => void;
}

const CreateEventHeader: React.FC<ICreateEventHeaderProps> = ({
  onSaveDraft,
  onCancel,
}) => {
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        <Box
          component={Link}
          href="/dashboard"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            color: "text.primary",
            "&:hover": { opacity: 0.8 },
          }}
        >
          <BoltIcon className="w-6 h-6 text-[#ee2b8c]" />
          <Typography
            variant="h6"
            fontWeight="900"
            sx={{ fontFamily: "var(--font-display)", letterSpacing: "-0.5px" }}
          >
            Hype
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            onClick={onSaveDraft}
            variant="contained"
            sx={{
              bgcolor: "#ee2b8c",
              color: "white",
              borderRadius: 1,
              px: 3,
              py: 1,
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { bgcolor: "#d6197b" },
            }}
          >
            Save Draft
          </Button>
          <Button
            onClick={onCancel}
            variant="contained"
            disableElevation
            sx={{
              bgcolor: "action.hover",
              color: "text.primary",
              borderRadius: 1,
              px: 3,
              py: 1,
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CreateEventHeader;
