import { Box } from "@mui/material";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: theme.palette.background.alt, // accessing the bg color from our theme.js file
  borderRadius: "0.75rem",
}));

export default WidgetWrapper;

// this setting will give us a global settings for all the widgets