import { environment } from "@/environment/environment-dsv";
import axios from "axios";
import { defineStore } from "pinia";

export const useParcelaStore = defineStore('parcela', {
	state: () => ({}),
	actions: {
		async calcularParcelamento(dadosParcelamento: any) {
			const resposta = await axios.post(`${environment.API_URL}/parcela/calcular`, dadosParcelamento)
			return resposta
		},
	},
	getters: {}
})