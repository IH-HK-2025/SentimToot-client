import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { AuthProviderWrapper } from "./context/auth.context";
import "@mantine/core/styles.css";
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <AuthProviderWrapper>
        <App />
      </AuthProviderWrapper>
    </MantineProvider>
  </React.StrictMode>
)