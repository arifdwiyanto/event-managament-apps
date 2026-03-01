import {
  EnvelopeIcon,
  PauseCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

const QuickActionsCard = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 800, mb: 3, color: "text.primary" }}
      >
        Quick Actions
      </Typography>

      <List disablePadding>
        {/* Pause Sales */}
        <ListItem disablePadding sx={{ mb: 2 }}>
          <ListItemButton
            sx={{
              borderRadius: 2,
              p: 1,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 48 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "#fce4ec",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#e91e63",
                }}
              >
                <PauseCircleIcon className="w-5 h-5" />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary="Pause Sales"
              slotProps={{
                primary: {
                  variant: "body2",
                  fontWeight: 700,
                  color: "text.primary",
                },
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Create Promotion */}
        <ListItem disablePadding sx={{ mb: 2 }}>
          <ListItemButton
            sx={{
              borderRadius: 2,
              p: 1,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 48 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "#f3e5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9c27b0",
                }}
              >
                <TagIcon className="w-5 h-5" />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary="Create Promotion"
              slotProps={{
                primary: {
                  variant: "body2",
                  fontWeight: 700,
                  color: "text.primary",
                },
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Email Attendees */}
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 2,
              p: 1,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 48 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "#fff8e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f57f17",
                }}
              >
                <EnvelopeIcon className="w-5 h-5" />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary="Email Attendees"
              slotProps={{
                primary: {
                  variant: "body2",
                  fontWeight: 700,
                  color: "text.primary",
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Paper>
  );
};

export default QuickActionsCard;
