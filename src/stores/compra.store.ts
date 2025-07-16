import { useAutenticacaoStore } from './autenticacao.store'
import { environment } from '@/environment/environment-dsv'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useCompraStore = defineStore('compra', {
  state: () => ({}),
  actions: {
    async cadastrar(dadosCompra: any) {
      const resposta = await axios.post(`${environment.API_URL}/compra`, dadosCompra, {
        headers: {
          Authorization: `Bearer ${useAutenticacaoStore().token}`,
        },
      })
      return resposta
    },

    async listar() {
      const resposta = await axios.get(`${environment.API_URL}/compra`, {
        headers: {
          Authorization: `Bearer ${useAutenticacaoStore().token}`,
        },
      })

      return resposta
    },
  },
  getters: {},
})
