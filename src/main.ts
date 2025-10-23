import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'primeicons/primeicons.css'
import './assets/main.scss'
import './assets/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import { useAutenticacaoStore } from './stores/autenticacao.store'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: definePreset(Aura, {
      semantic: {
        primary: {
          50: '{teal.50}',
          100: '{teal.100}',
          200: '{teal.200}',
          300: '{teal.300}',
          400: '{teal.400}',
          500: '{teal.500}',
          600: '{teal.600}',
          700: '{teal.700}',
          800: '{teal.800}',
          900: '{teal.900}',
          950: '{teal.950}',
        },
      },
    }),
    options: {
      darkModeSelector: 'none',
    },
  },
})

const pinia = createPinia()
app.use(pinia)
app.use(router)

app.use(ToastService)
// Configurar interceptors do axios
// Interceptor de requisição - adiciona token automaticamente e verifica expiração
axios.interceptors.request.use(
  (config) => {
    const autenticacaoStore = useAutenticacaoStore()
    
    // Verifica se o token está expirado
    if (autenticacaoStore.accessToken?.accessToken && !autenticacaoStore.verificarTokenExpirado()) {
      // Token expirado, redirecionar para login
      router.push('/')
      return Promise.reject(new Error('Token expirado'))
    }
    
    // Adiciona o token de autorização automaticamente se existir
    if (autenticacaoStore.accessToken?.accessToken) {
      config.headers.Authorization = `Bearer ${autenticacaoStore.accessToken.accessToken}`
    }
    
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor de resposta - detecta erros de autenticação
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 402) {
      const autenticacaoStore = useAutenticacaoStore()
      autenticacaoStore.logout()
      router.push('/')
    }
    return Promise.reject(error)
  },
)

app.mount('#app')
