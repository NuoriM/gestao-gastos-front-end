import { environment } from '@/environment/environment-dsv'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useCompraStore = defineStore('compra', {
  state: () => ({}),
  actions: {
    async obterPorCodigo(codigoCalendario: number, codigoCompra: number) {
      const resposta = await axios.get(
        `${environment.API_URL}/calendarios/${codigoCalendario}/compras/${codigoCompra}`,
      )
      return resposta
    },

    async cadastrar(dadosCompra: any) {
      const resposta = await axios.post(`${environment.API_URL}/compra`, dadosCompra)
      return resposta
    },

    async listar() {
      const resposta = await axios.get(`${environment.API_URL}/compra`)
      return resposta
    },

    async editar(codigoCalendario: number, codigoCompra: number, dadosCompra: any) {
      const resposta = await axios.put(`${environment.API_URL}/calendarios/${codigoCalendario}/compras/${codigoCompra}`, dadosCompra)
      return resposta
    },
  },
  getters: {},
})
