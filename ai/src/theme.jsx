// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2684FF', // Jira blue
    },
    secondary: {
      main: '#0052cc',
    },
    background: {
      default: '#ffffff',
      paper: '#f4f5f7',
    },
    text: {
      primary: '#172b4d',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default theme;
