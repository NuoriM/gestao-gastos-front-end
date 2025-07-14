import { useAutenticacaoStore } from "./autenticacao";
import { environment } from "@/environment/environment-dsv";
import axios from "axios";
import { defineStore } from "pinia";

export const useCompraStore = defineStore('compra', {
	state: () => ({}),
	actions: {
		async cadastrar(dadosCompra: any) {
			try {
				const resposta = await axios.post(`${environment.API_URL}/compra`, dadosCompra, {
					headers: {
						'Authorization': `Bearer ${useAutenticacaoStore().token}`
					}
				});
				
				return resposta;
			} catch (error) {
				console.error('Erro ao cadastrar compra:', error);
				throw error;
			}
		},
	},
	getters: {},
})