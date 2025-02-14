import { createTheme } from "@mui/material/styles";

export const themeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#006B3F", // Official green color
      contrastText: "#ffffff", // White text for contrast
    },
    secondary: {
      main: "#ffffff", // White as the secondary color
      contrastText: "#006B3F", // Green text for contrast
    },
    background: {
      default: "#F7F7F7", // Light grey background
      paper: "#ffffff", // White background for paper components
    },
    text: {
      primary: "#006B3F", // Green primary text
      secondary: "#7D8A97", // Grey secondary text
    },
    error: {
      main: "#E74C3C", // Red for error messages
    },
    warning: {
      main: "#E67E22", // Orange for warnings
    },
    info: {
      main: "#3498DB", // Blue for informational messages
    },
    divider: "#D1D5DB", // Light grey dividers
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif", // Professional and clean font stack
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Slightly rounded corners
          textTransform: "none", // Preserve original text casing
          fontWeight: "bold", // Bold text for buttons
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#006B3F", // Apply primary green color to AppBar
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
