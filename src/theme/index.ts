import { createTheme } from '@mui/material/styles';

// Import the font family constant for consistency
// const FONT_FAMILY = '"TeleNeoWeb", "Inter", "Roboto", "Helvetica", "Arial", sans-serif';
const FONT_FAMILY = '"Roboto", "sans-serif"';
// const FONT_FAMILY = '"Playwrite HU", cursive';

const theme = createTheme({
  palette: {
    primary: {
      main: '#016174',
      light: '#4a8a9a',
      dark: '#003d4a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#f5f5f5',
      contrastText: '#016174',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: FONT_FAMILY,
    h1: {
      fontSize: '40px',
      fontWeight: 700,
      lineHeight: 1.2,
      fontFamily: FONT_FAMILY,
    },
    h2: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.3,
      fontFamily: FONT_FAMILY,
    },
    h3: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: FONT_FAMILY,
    },
    h4: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: FONT_FAMILY,
    },
    h5: {
      fontSize: '20px',
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: FONT_FAMILY,
    },
    h6: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1.5,
      fontFamily: FONT_FAMILY,
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: FONT_FAMILY,
    },
    body2: {
      fontSize: '17px',
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: FONT_FAMILY,
    },
    button: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.75,
      fontFamily: FONT_FAMILY,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.66,
      fontFamily: FONT_FAMILY,
    },
    overline: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: 2.66,
      fontFamily: FONT_FAMILY,
    },
    subtitle1: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1.75,
      fontFamily: FONT_FAMILY,
    },
    subtitle2: {
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.57,
      fontFamily: FONT_FAMILY,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          html: {
            fontFamily: FONT_FAMILY,
          },
          body: {
            fontFamily: FONT_FAMILY,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
          fontFamily: FONT_FAMILY,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(1, 97, 116, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            fontFamily: FONT_FAMILY,
          },
          '& .MuiInputLabel-root': {
            fontFamily: FONT_FAMILY,
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          '& .MuiTypography-root': {
            fontFamily: FONT_FAMILY,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          '& .MuiTypography-root': {
            fontFamily: FONT_FAMILY,
          },
          '& .MuiListItemText-root': {
            '& .MuiTypography-root': {
              fontFamily: FONT_FAMILY,
            },
          },
        },
      },
    },
  },
});

export default theme;