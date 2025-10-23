import type { IEntrarRequest } from '@/core/interfaces/entrar-request.interface'
import type { IRegistroRequest } from '@/core/interfaces/registro-request.interface'
import { environment } from '@/environment/environment-dsv'
import axios from 'axios'
import { defineStore } from 'pinia'

// Função para verificar se o token é válido
function isTokenValid(token: string | null): boolean {
  if (!token) return false
  
  try {
    // Decodifica o JWT para verificar se expirou
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp > currentTime
  } catch {
    return false
  }
}

export const useAutenticacaoStore = defineStore('autenticacao', {
  state: () => ({
    accessToken: JSON.parse(sessionStorage.getItem('accessToken') || 'null') as any,
  }),

  actions: {
    async entrar(dadosAcesso: IEntrarRequest) {
      try {
        const resposta = await axios.post(`${environment.API_URL}/auth/entrar`, dadosAcesso)
        this.accessToken = resposta.data
        sessionStorage.setItem('accessToken', JSON.stringify(resposta.data))

        return resposta
      } catch (error) {
        console.error('Erro ao entrar:', error)
        throw error
      }
    },
    async registrar(dadosRegistro: IRegistroRequest) {
      try {
        return axios.post(`${environment.API_URL}/auth/registrar`, dadosRegistro)
      } catch (error) {
        console.error('Erro ao registrar:', error)
        throw error
      }
    },
    logout() {
      this.accessToken = null
      sessionStorage.removeItem('accessToken')
    },
    verificarTokenExpirado() {
      if (!isTokenValid(this.accessToken.accessToken)) {
        this.logout()
        return false
      }
      return true
    },
  },
  getters: {
    isAuthenticated: (state) => isTokenValid(state.accessToken?.accessToken),
  },
})
