import { defineStore } from 'pinia'
import { useAutenticacaoStore } from './autenticacao.store'
import axios from 'axios'
import { environment } from '@/environment/environment-dsv'

export const useCategoriaStore = defineStore('categoria', {
  state: () => ({}),
  getters: {},
  actions: {
    async cadastrar(dadosCategoria: any) {
      const resposta = await axios.post(`${environment.API_URL}/categoria`, dadosCategoria, {
        headers: {
          Authorization: `Bearer ${useAutenticacaoStore().token}`,
        },
      })
      return resposta
    },

    async editar(dadosCategoria: any) {
      const resposta = await axios.put(`${environment.API_URL}/categoria`, dadosCategoria, {
        headers: {
          Authorization: `Bearer ${useAutenticacaoStore().token}`,
        },
      })
      return resposta
    },

    async remover(id: any) {

      const resposta = await axios.delete(`${environment.API_URL}/categoria/${id}`, {
        headers: {
          Authorization: `Bearer ${useAutenticacaoStore().token}`,
        },
      })
      return resposta
    },

    async listarPaginado() {
      const resposta = await axios.get(`${environment.API_URL}/categoria/paginado`, {
        headers: {
          Authorization: `Bearer ${useAutenticacaoStore().token}`,
        },
      })
      return resposta
    },

    async listarDropDown() {
      const resposta = await axios.get(`${environment.API_URL}/categoria/dropdown`, {
        headers: {
          Authorization: `Bearer ${useAutenticacaoStore().token}`,
        },
      })
      return resposta
    },
  },
})