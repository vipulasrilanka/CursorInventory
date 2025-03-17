import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#E31837', // Zone24x7 red
      contrastText: '#fff',
    },
    secondary: {
      main: '#000000', // Black
      contrastText: '#fff',
    },
    background: {
      default: '#000000', // Black background
      paper: '#ffffff',   // White cards/paper
    },
    text: {
      primary: '#ffffff', // White text for dark background
      secondary: '#cccccc', // Light gray text for dark background
    },
    divider: '#000000', // Set divider color to black
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '2px solid #E31837',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        contained: {
          backgroundColor: '#E31837',
          '&:hover': {
            backgroundColor: '#b31329',
          },
        },
        outlined: {
          borderColor: '#E31837',
          color: '#E31837',
          '&:hover': {
            borderColor: '#b31329',
            backgroundColor: 'rgba(227, 24, 55, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid #E31837',
          backgroundColor: '#ffffff',
          '& .MuiCardContent-root': {
            backgroundColor: '#ffffff',
          },
          '& .MuiTypography-root': {
            color: '#000000',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
          '&.MuiAppBar-root': {
            backgroundColor: '#000000',
            color: '#ffffff',
          },
        },
        elevation1: {
          boxShadow: '0 0 10px rgba(227, 24, 55, 0.2)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 0,
          color: '#000000',
          '&:before': {
            borderBottom: '2px solid #000000',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid #000000',
          },
          '&.Mui-focused:after': {
            borderBottom: '2px solid #E31837',
          },
          '& .MuiInputBase-input': {
            color: '#000000',
          },
          '& .MuiInput-input': {
            color: '#000000',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 0,
          color: '#000000',
        },
        input: {
          color: '#000000',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            color: '#000000',
            '& input': {
              color: '#000000',
            },
            '& fieldset': {
              borderColor: '#000000',
            },
            '&:hover fieldset': {
              borderColor: '#000000',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E31837',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#000000',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#E31837',
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#000000',
          '&.Mui-focused': {
            color: '#E31837',
          },
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          '&.search-box': {
            border: '1px solid #000000',
            '&:hover': {
              border: '1px solid #000000',
            },
            '&:focus-within': {
              border: '1px solid #E31837',
            },
          },
        },
      },
    },
  },
}); 