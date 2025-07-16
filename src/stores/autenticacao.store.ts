import type { IEntrarRequest } from '@/core/interfaces/entrar-request.interface'
import type { IRegistroRequest } from '@/core/interfaces/registro-request.interface'
import { environment } from '@/environment/environment-dsv'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useAutenticacaoStore = defineStore('autenticacao', {
  state: () => ({
    token: sessionStorage.getItem('token'),
  }),

  actions: {
    async entrar(dadosAcesso: IEntrarRequest) {
      try {
        const resposta = await axios.post(`${environment.API_URL}/auth/entrar`, dadosAcesso)
        this.token = resposta.data.token

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
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
})
