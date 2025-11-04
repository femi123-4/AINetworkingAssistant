import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AskAi from './askAi.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AskAi />
  </StrictMode>,
)
