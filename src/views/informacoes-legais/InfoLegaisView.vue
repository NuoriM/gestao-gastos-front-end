<script setup lang="ts"></script>
<template>
	<Toolbar>
		<template #start>
			<div class="flex items-center gap-2">
				<RouterLink to="/registro">
					<Button label="Voltar" text plain />
				</RouterLink>
				<span class="logo-font">Gestão de Gastos</span>
			</div>
		</template>

		<template #end>
			<div class="flex items-center gap-2">
				<RouterLink to="termos-de-uso">
					<Button label="Termos de Uso" text plain />
				</RouterLink>
				<RouterLink to="politica-de-privacidade">
					<Button label="Politica de Privacidade" text plain />
				</RouterLink>
			</div>
		</template>
	</Toolbar>
	<RouterView />
</template>
<style lang="scss">
body {
	background-color: #EFEEEA;
}
</style>