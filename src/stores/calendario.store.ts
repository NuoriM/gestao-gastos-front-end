import { environment } from '@/environment/environment-dsv'
import axios from 'axios'
import { defineStore } from 'pinia'
import { useAutenticacaoStore } from './autenticacao.store'

export const useCalendarioStore = defineStore('calendario', {
  state: () => ({}),
  getters: {},
  actions: {
    async listarCalendarios() {
      const response = await axios.get(`${environment.API_URL}/calendario/dropdown`, {
        headers: {
          Authorization: `Bearer ${useAutenticacaoStore().token}`,
        },
      })
      return response
    },

    async listarCategoriasPorCodigoCalendarioDropdown(codigoCalendario: number) {
      const response = await axios.get(`${environment.API_URL}/calendario/${codigoCalendario}/categorias/dropdown`, {
        headers: {
          Authorization: `Bearer ${useAutenticacaoStore().token}`,
        },
      })
      return response
    },
    
    async cadastrar(dadosCalendario: any) {
      const response = await axios.post(`${environment.API_URL}/calendario`, dadosCalendario, {
        headers: {
          Authorization: `Bearer ${useAutenticacaoStore().token}`,
        },
      })
      return response
    },

    async listarComprasPorCalendario(codigoCalendario: number) {
      const response = await axios.get(
        `${environment.API_URL}/calendario/${codigoCalendario}/compras`,
        {
          headers: {
            Authorization: `Bearer ${useAutenticacaoStore().token}`,
          },
        },
      )
      return response
    },

  },
})
