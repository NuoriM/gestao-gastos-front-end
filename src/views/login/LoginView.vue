<script lang="ts">
import { useAutenticacaoStore } from '@/stores/autenticacao.store';
import type { IEntrarRequest } from '@/core/interfaces/entrar-request.interface';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { loginSchema } from '@/core/schemas/login/login.schema';

export default {
	setup() {
		const autenticacaoStore = useAutenticacaoStore();

		return { autenticacaoStore };
	},
	data() {
		return {
			dadosAcesso: <IEntrarRequest>{},
			resolver: zodResolver(loginSchema)
		}
	},

	methods: {
		async entrar(event: any) {
			if (event.valid) {
				const resp = await this.autenticacaoStore.entrar(event.values);
				if (resp.status !== 200) {
					return;
				}
				this.$router.push({ path: '/painel' });
			}
		}
	}
}
</script>
<template>
	<div class="container">
		<div class="row">
			<div class="col-md d-none d-md-block align-content-center" style="height: 30rem;">
				<h1 class="logo-font">Gestão de Gastos
				</h1>
				<p style="font-size: 1.2rem; color: #6c757d;margin-top: 0.5rem;">
					Sistema de gestão de gastos online, seguro e privado.
				</p>
			</div>
			<div class="col-md align-content-center" style="height: 30rem;">
				<h1 class=" d-block d-md-none logo-font text-center mb-4">Gestão de Gastos
				</h1>
				<Form v-slot="$form" :resolver="resolver" :initialValues="dadosAcesso" @submit="entrar"
					class="shadow rounded bg-white bg-opacity-75 text-black align-content-center px-4 py-4">
					<div class="mb-3">
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
					<div class="mb-3">
						<FloatLabel variant="in">
							<Password id="senha-input" name="senha" :feedback="false" variant="filled" toggleMask
								fluid />
							<label for="senha-input" class="form-label">Senha</label>
						</FloatLabel>
						<Message v-if="$form.senha?.invalid" class="mt-1" severity="error" size="small"
							variant="simple">
							{{ $form.senha.error?.message }}
						</Message>
					</div>
					<Button type="submit" label="Entrar" :fluid="true" />
					<div class="mt-4 text-center text-muted">
						Não possui uma conta? <router-link to="/registro">Cadastre-se</router-link>
					</div>
				</Form>
			</div>
		</div>
	</div>
	<Footer />
</template>
<style scoped lang="scss"></style>