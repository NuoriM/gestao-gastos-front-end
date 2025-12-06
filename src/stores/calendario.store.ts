import { environment } from '@/environment/environment-dsv'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useCalendarioStore = defineStore('calendario', {
  state: () => ({}),
  getters: {},
  actions: {
    async listarCalendarios() {
      const response = await axios.get(`${environment.API_URL}/calendarios/dropdown`)
      return response
    },

    async listarCategoriasPorCodigoCalendarioDropdown(codigoCalendario: number) {
      const response = await axios.get(`${environment.API_URL}/calendarios/${codigoCalendario}/categorias/dropdown`)
      return response
    },
    
    async cadastrar(dadosCalendario: any) {
      const response = await axios.post(`${environment.API_URL}/calendario`, dadosCalendario)
      return response
    },

    async listarComprasPorCalendario(codigoCalendario: number) {
      const response = await axios.get(`${environment.API_URL}/calendarios/${codigoCalendario}/compras`)
      return response
    },

    async listarDropDown(codigoCalendario: number) {
      const resposta = await axios.get(`${environment.API_URL}/calendarios/${codigoCalendario}/cartoes/dropdown`)
      return resposta
    },

    async obterCategoriaPorCodigo(codigoCalendario: number, codigoCategoria: number) {
      const resposta = await axios.get(`${environment.API_URL}/${codigoCalendario}/categorias/${codigoCategoria}`)
      return resposta
    },

    async cadastrarCategoria(codigoCalendario: number, dadosCategoria: any) {
      const resposta = await axios.post(`${environment.API_URL}/calendario/${codigoCalendario}/categorias`, dadosCategoria)
      return resposta
    },

    async editarCategoria(codigoCalendario: number, dadosCategoria: any) {
      const resposta = await axios.put(`${environment.API_URL}/calendario/${codigoCalendario}/categorias`, dadosCategoria)
      return resposta
    },
    
    async cadastrarCartao(codigoCalendario: number, dadosCartao: any) {
      const resposta = await axios.post(`${environment.API_URL}/calendario/${codigoCalendario}/cartoes`, dadosCartao)
      return resposta
    },
  },
})
