<script setup lang="ts"></script>
<template>
	<footer class="app-footer text-center text-lg-start text-white">
		<div class="container p-4 pb-0">
			<div class="row">
				<div class="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
					<h6 class="text-uppercase mb-4 font-weight-bold">
						Links Uteis
					</h6>
					<ul class="list-unstyled">
						<li class="mb-2">
							<router-link class="text-white" to="/informacoes-legais/termos-de-uso">
								Termos de Uso
							</router-link>
						</li>
						<li>
							<router-link class="text-white" to="/informacoes-legais/politica-de-privacidade">
								Politica de Privacidade
							</router-link>
						</li>
					</ul>
				</div>

				<hr class="w-100 clearfix d-md-none" />

				<div class="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
					<h6 class="text-uppercase mb-4 font-weight-bold">
						Contato
					</h6>
					<ul class="list-unstyled">
						<li class="mb-2">
							<i class="pi pi-discord"></i> NuoriM & Priska
						</li>
						<li class="mb-2">
							<a class="text-white" href="https://github.com/NuoriM" target="_blank">
								<i class="pi pi-github mr-3"></i> NuoriM
							</a>
						</li>
						<li class="mb-2">
							<i class="pi pi-envelope"></i> nuorim.contato@gmail.com
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2)">
			2025 Copyright:
			<router-link class="text-white" to="/" style="text-decoration: none;">Gestão de Gastos</router-link>
		</div>
	</footer>
</template>