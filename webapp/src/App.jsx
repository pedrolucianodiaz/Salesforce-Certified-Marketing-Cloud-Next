import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import {
  AppBar, Toolbar, IconButton, Typography, Box, Drawer,
  List, ListItemButton, ListItemText, ListItemIcon, Paper, Button,
  Link, useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import Welcome from './Welcome'
import './App.css'

const WELCOME_KEY = 'mcnext_welcome_seen'
const DRAWER_WIDTH = 300

// Estructura de la guía: categorías con sus capítulos. Los .md se sirven desde public/guia/.
const SECTIONS = [
  {
    title: 'Introducción',
    chapters: [
      { title: 'Introducción', file: 'guia/introduccion/01-introduccion.md' },
      { title: 'Marketing basado en agentes', file: 'guia/introduccion/02-marketing-basado-en-agentes.md' },
      { title: 'La evolución de Marketing Cloud', file: 'guia/introduccion/03-evolucion-de-marketing-cloud.md' },
    ],
  },
]

// Lista plana de capítulos, para la navegación anterior/siguiente y los puntos.
const CHAPTERS = SECTIONS.flatMap((s) => s.chapters)

// Tamaños base (en px), ya 2 puntos más chicos que la escala Material por defecto.
// Se multiplican por `scale` (el zoom que controla el usuario).
const BASE = { h1: 22, h2: 18, h3: 16, h4: 14, body: 14 }

// Mapea cada elemento Markdown a Material, con tamaño escalado por el zoom.
function makeMdComponents(scale) {
  const px = (n) => `${n * scale}px`
  return {
    h1: ({ children }) => (
      <Typography
        component="h1"
        gutterBottom
        sx={{ fontSize: px(BASE.h1), fontWeight: 700, color: 'secondary.main', borderBottom: 2, borderColor: 'primary.main', pb: 1.2, mt: 0, lineHeight: 1.3 }}
      >
        {children}
      </Typography>
    ),
    h2: ({ children }) => (
      <Typography component="h2" sx={{ fontSize: px(BASE.h2), fontWeight: 700, color: 'secondary.main', mt: 4, mb: 1, lineHeight: 1.35 }}>
        {children}
      </Typography>
    ),
    h3: ({ children }) => (
      <Typography component="h3" sx={{ fontSize: px(BASE.h3), fontWeight: 600, color: 'secondary.main', mt: 3, mb: 1 }}>
        {children}
      </Typography>
    ),
    h4: ({ children }) => (
      <Typography component="h4" sx={{ fontSize: px(BASE.h4), fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.4, mt: 2.5, mb: 0.5 }}>
        {children}
      </Typography>
    ),
    p: ({ children }) => (
      <Typography paragraph sx={{ fontSize: px(BASE.body), lineHeight: 1.75 }}>
        {children}
      </Typography>
    ),
    li: ({ children }) => (
      <li>
        <Typography component="span" sx={{ fontSize: px(BASE.body), lineHeight: 1.75 }}>
          {children}
        </Typography>
      </li>
    ),
    a: ({ href, children }) => (
      <Link href={href} target="_blank" rel="noopener" underline="hover" sx={{ fontSize: px(BASE.body) }}>
        {children}
      </Link>
    ),
  }
}

export default function App() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const [active, setActive] = useState(0)
  const [content, setContent] = useState('Cargando…')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(
    () => localStorage.getItem(WELCOME_KEY) !== '1'
  )
  // Zoom de fuente: 1 = normal. Se recuerda en el navegador.
  const [scale, setScale] = useState(() => {
    const s = parseFloat(localStorage.getItem('mcnext_font_scale'))
    return s >= 0.8 && s <= 1.6 ? s : 1
  })

  function changeScale(delta) {
    setScale((prev) => {
      const next = Math.min(1.6, Math.max(0.8, Math.round((prev + delta) * 100) / 100))
      localStorage.setItem('mcnext_font_scale', String(next))
      return next
    })
  }

  const mdComponents = makeMdComponents(scale)

  // Espaciador que iguala la altura del AppBar.
  const HeaderSpacer = () => <Toolbar />

  function dismissWelcome(lang = 'es') {
    localStorage.setItem(WELCOME_KEY, '1')
    localStorage.setItem('mcnext_lang', lang)
    setShowWelcome(false)
  }

  // El fondo del body sigue a la pantalla activa (azul en bienvenida, gris en app),
  // así el rebote de scroll en mobile no muestra una franja blanca.
  useEffect(() => {
    document.body.classList.toggle('welcome-active', showWelcome)
  }, [showWelcome])

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + CHAPTERS[active].file)
      .then((r) => r.text())
      .then(setContent)
      .catch(() => setContent('No se pudo cargar el capítulo.'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [active])

  function go(i) {
    setActive(i)
    setMenuOpen(false)
  }

  if (showWelcome) {
    return <Welcome onContinue={dismissWelcome} />
  }

  const drawerContent = (
    <Box sx={{ width: DRAWER_WIDTH }} role="navigation">
      {!isDesktop && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, pt: 1 }}>
          <IconButton size="small" onClick={() => setMenuOpen(false)} aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      <List sx={{ px: 1 }}>
        {SECTIONS.map((section) => (
          <Box key={section.title} sx={{ mb: 1 }}>
            {/* Encabezado de categoría */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, pt: 1.5, pb: 0.5 }}>
              <FolderOpenIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography
                variant="overline"
                sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 0.6, lineHeight: 1.4 }}
              >
                {section.title}
              </Typography>
            </Box>
            {/* Subcapítulos, indentados bajo la categoría */}
            {section.chapters.map((ch) => {
              const i = CHAPTERS.indexOf(ch)
              return (
                <ListItemButton
                  key={ch.file}
                  selected={i === active}
                  onClick={() => go(i)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    ml: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: '#fff',
                      '&:hover': { bgcolor: 'primary.dark' },
                      '& .MuiListItemIcon-root': { color: '#fff' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 34 }}>
                    <MenuBookIcon fontSize="small" color={i === active ? 'inherit' : 'action'} />
                  </ListItemIcon>
                  <ListItemText primary={ch.title} slotProps={{ primary: { sx: { fontSize: 12, fontWeight: i === active ? 600 : 400 } } }} />
                </ListItemButton>
              )
            })}
          </Box>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Barra superior Material — mismo degradado azul que la bienvenida */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          backgroundImage: 'linear-gradient(135deg, #0176d3 0%, #0b5cab 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton color="inherit" edge="start" onClick={() => setMenuOpen((o) => !o)} aria-label="Abrir o cerrar menú" sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1, lineHeight: 1.1 }}>
            <Typography variant="subtitle1" fontWeight={700} component="div">MC Next</Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>Guía de estudio</Typography>
          </Box>
          {/* Controles de zoom, a la derecha de la barra */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={() => changeScale(-0.1)} disabled={scale <= 0.8} aria-label="Achicar letra" sx={{ color: '#fff', p: 0.5 }}>
              <ZoomOutIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton size="small" onClick={() => changeScale(0.1)} disabled={scale >= 1.6} aria-label="Agrandar letra" sx={{ color: '#fff', p: 0.5 }}>
              <ZoomInIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer: permanente en desktop, temporal en mobile */}
      {isDesktop ? (
        <Drawer
          variant="permanent"
          sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        >
          <HeaderSpacer />
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="temporary" open={menuOpen} onClose={() => setMenuOpen(false)} ModalProps={{ keepMounted: true }}>
          <HeaderSpacer />
          {drawerContent}
        </Drawer>
      )}

      {/* Contenido */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', px: 2, pb: 12, pt: 0 }}>
        <Box sx={{ width: '100%', maxWidth: 760 }}>
          <HeaderSpacer />
          <Paper
            elevation={0}
            className="markdown-body"
            sx={{
              p: { xs: 3, md: 4.5 },
              mt: 2.5,
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={mdComponents}>{content}</ReactMarkdown>
          </Paper>
        </Box>
      </Box>

      {/* Barra inferior tipo app (solo mobile) */}
      {!isDesktop && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed', zIndex: 30,
            left: 16, right: 16,
            bottom: 'calc(16px + env(safe-area-inset-bottom))',
            borderRadius: 30,
            backgroundImage: 'linear-gradient(135deg, #0176d3 0%, #0b5cab 100%)',
            color: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1, py: 0.6 }}>
            <Button
              size="small"
              startIcon={<ChevronLeftIcon />}
              disabled={active === 0}
              onClick={() => go(active - 1)}
              sx={{ fontSize: 12, color: '#fff', '&.Mui-disabled': { color: 'rgba(255,255,255,0.4)' } }}
            >
              Anterior
            </Button>
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              {CHAPTERS.map((_, i) => (
                <Box
                  key={i}
                  onClick={() => go(i)}
                  sx={{
                    width: i === active ? 16 : 7, height: 7, borderRadius: 4, cursor: 'pointer',
                    bgcolor: i === active ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all .2s',
                  }}
                />
              ))}
            </Box>
            <Button
              size="small"
              endIcon={<ChevronRightIcon />}
              disabled={active === CHAPTERS.length - 1}
              onClick={() => go(active + 1)}
              sx={{ fontSize: 12, color: '#fff', '&.Mui-disabled': { color: 'rgba(255,255,255,0.4)' } }}
            >
              Siguiente
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  )
}
