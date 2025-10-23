import { defineStore } from 'pinia'
import axios from 'axios'
import { environment } from '@/environment/environment-dsv'

export const useCategoriaStore = defineStore('categoria', {
  state: () => ({}),
  getters: {},
  actions: {
    async cadastrar(dadosCategoria: any) {
      const resposta = await axios.post(`${environment.API_URL}/categoria`, dadosCategoria)
      return resposta
    },

    async editar(dadosCategoria: any) {
      const resposta = await axios.put(`${environment.API_URL}/categoria`, dadosCategoria)
      return resposta
    },

    async remover(id: any) {
      const resposta = await axios.delete(`${environment.API_URL}/categoria/${id}`)
      return resposta
    },

    async listarPaginado() {
      const resposta = await axios.get(`${environment.API_URL}/categoria/paginado`)
      return resposta
    },

    async listarDropDown() {
      const resposta = await axios.get(`${environment.API_URL}/categoria/dropdown`)
      return resposta
    },
  },
})