import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeText {
    success: string;
  }

  interface Palette {
    custom: {
      light: string;
      main: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      light: string;
      main: string;
      dark: string;
    };
  }
}

const WebTheme = createTheme({
  palette: {
    primary: {
      main: "#ADD8E6",
      light: "#fff",
      dark: "#fff",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#000",
      light: "#334F3E",
      dark: "#bb002f",
      contrastText: "#ffffff",
    },
    error: {
      main: "#F23E14",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#ffffff",
    },
    info: {
      main: "#A7C7E7",
      light: "#64b5f6",
      dark: "#CB9476",
      contrastText: "#ffffff",
    },
    success: {
      main: "#1E2624",
      light: "#334F3E",
      dark: "#388e3c",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#1E2C24",
      secondary: "#424242",
      success: "#4B5565",
      disabled: "#9e9e9e",
    },
    divider: "#bdbdbd",
    background: {
      paper: "#ffffff",
      default: "#fafafa",
    },
    action: {
      active: "#424242",
      hover: "#e0e0e0",
      selected: "#bdbdbd",
      disabled: "#9e9e9e",
      disabledBackground: "#e0e0e0",
    },
    custom: {
      light: "#ffffff",
      main: "#00acc1",
      dark: "#006c75",
    },
  },
});

export default WebTheme;
