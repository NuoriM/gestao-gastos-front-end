<script setup lang="ts">
import type { IRegistroRequest } from '@/core/interfaces/registro-request.interface';
</script>
<script lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';

export default {
	data() {
		return {
			dadosRegistro: <IRegistroRequest>{},
			resolver: zodResolver(z.object({
				nome: z.string({ required_error: 'O nome é obrigatório' }).min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
				sobrenome: z.string({ required_error: 'O sobrenome é obrigatório' }).min(3, { message: 'O sobrenome deve ter pelo menos 3 caracteres' }),
				emailTelefone: z.string({ required_error: 'O email ou telefone é obrigatório' }).min(5, { message: 'O email ou telefone deve ter pelo menos 5 caracteres' }),
				senha: z.string({ required_error: 'A senha é obrigatória' }).min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
			}))
		}
	},
	methods: {
		registrar(event: any) {
			if (event.valid) {
				console.log('Registrado com sucesso');
			}
		},
	},
}
</script>
<template>
	<div class="container mt-5 mb-5 pb-5 px-4 pt-4" style="max-width: 600px; margin: 0 auto;">
		<div class="row">
			<div class="col-md mb-4 text-center">
				<h1 class="logo-font">Gestão de Gastos</h1>
			</div>
		</div>
		<div class="row shadow rounded bg-white bg-opacity-75 text-black align-content-center">
			<div class="col-md my-4 p-0 text-center">
				<Form v-slot="$form" :resolver="resolver" :initialValues="dadosRegistro" @submit="registrar">
					<div class="pb-3 mb-3 text-center fw-bold fs-4 border-bottom">
						Criar uma nova conta
						<div class="fs-6 text-muted">É rápido, fácil e seguro</div>
					</div>
					<div class="mb-3 d-flex justify-content-between px-4">
						<div class="flex-fill me-2">
							<FloatLabel variant="in">
								<InputText id="nome-input" type="text" name="nome" :fluid="true" variant="filled" />
								<label for="nome-input" class="form-label">Nome</label>
							</FloatLabel>
							<Message v-if="$form.nome?.invalid" class="mt-1" severity="error" size="small"
								variant="simple">
								{{ $form.nome.error?.message }}
							</Message>
						</div>
						<div class="flex-fill ms-2">
							<FloatLabel variant="in">
								<InputText id="sobrenome-input" type="text" name="sobrenome" :fluid="true"
									variant="filled" />
								<label for="sobrenome-input" class="form-label">Sobrenome</label>
							</FloatLabel>
							<Message v-if="$form.sobrenome?.invalid" class="mt-1" severity="error" size="small"
								variant="simple">
								{{ $form.sobrenome.error?.message }}
							</Message>
						</div>
					</div>
					<div class="mb-3 px-4">
						<FloatLabel variant="in">
							<InputText id="email-telefone-input" type="text" name="emailTelefone" :fluid="true"
								variant="filled" />
							<label for="email-telefone-input" class="form-label">E-mail ou telefone</label>
						</FloatLabel>
						<Message v-if="$form.emailTelefone?.invalid" class="mt-1" severity="error" size="small"
							variant="simple">
							{{ $form.emailTelefone.error?.message }}
						</Message>
					</div>
					<div class="mb-3 px-4">
						<FloatLabel variant="in">
							<InputText id="senha-input" type="password" name="senha" :fluid="true" variant="filled" />
							<label for="senha-input" class="form-label">Nova senha</label>
						</FloatLabel>
						<Message v-if="$form.senha?.invalid" class="mt-1" severity="error" size="small"
							variant="simple">
							{{ $form.senha.error?.message }}
						</Message>
					</div>
					<div class="mb-3 px-4">
						<div class="form-text text-muted">
							Ao cadastrar você concorda com os <router-link to="/informacoes-legais/termos-de-uso">Termos
								de
								Uso</router-link> e a <router-link
								to="/informacoes-legais/politica-de-privacidade">Politica de
								Privacidade</router-link>
						</div>
					</div>
					<Button type="submit" severity="success" label="Cadastre-se" />
					<div class="mt-4 px-4 text-muted">
						Ja possui uma conta? <router-link to="/">Entre</router-link>
					</div>
				</Form>
			</div>
		</div>
	</div>
	<Footer />
</template>
<style scoped lang="scss"></style>