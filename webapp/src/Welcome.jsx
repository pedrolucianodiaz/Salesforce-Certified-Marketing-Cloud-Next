import { Button, Stack } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import './Welcome.css'

export default function Welcome({ onContinue }) {
  return (
    <div className="welcome">
      <div className="welcome-inner">
        <div className="welcome-illustration">
          <img
            src={import.meta.env.BASE_URL + 'study-illustration.png'}
            alt="Persona estudiando sobre una pila de libros con un laptop"
          />
        </div>

        <div className="welcome-text">
          <h1>Welcome to your study guide</h1>
          <p>
            A quick recap to review the <strong>Salesforce Marketing Cloud
            Next</strong> certification. The official module lives on{' '}
            <strong>Trailhead</strong>.
          </p>
          <p className="welcome-subtitle">
            Resumen de apoyo en español · No reemplaza el módulo oficial de Trailhead.
          </p>
        </div>

        <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 360 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => onContinue('en')}
            sx={{
              bgcolor: '#fff',
              color: 'primary.main',
              borderRadius: 30,
              py: 1.7,
              fontSize: 16,
              fontWeight: 700,
              '&:hover': { bgcolor: '#f0f7ff' },
            }}
          >
            Continue in English
          </Button>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => onContinue('es')}
            sx={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.7)',
              borderRadius: 30,
              py: 1.7,
              fontSize: 16,
              fontWeight: 700,
              '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.12)' },
            }}
          >
            Continuar en Español
          </Button>
        </Stack>
      </div>
    </div>
  )
}
