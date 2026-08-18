import { createTheme } from '@mui/material/styles'

// Tema Material Design con la paleta de Salesforce y tipografía Roboto.
const theme = createTheme({
  palette: {
    primary: { main: '#0176d3', dark: '#0b5cab', contrastText: '#fff' },
    secondary: { main: '#032d60' },
    background: { default: '#f3f6f9', paper: '#ffffff' },
    text: { primary: '#16325c', secondary: '#5e6b82' },
  },
  typography: {
    fontFamily: "'Roboto', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
  },
  shape: { borderRadius: 12 },
})

export default theme
