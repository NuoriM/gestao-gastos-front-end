<script lang="ts">
export default {
	data() {
		return {
			expandedKeys: {
				indice: true
			},
			sections: [
				{
					title: 'Aceitação dos Termos',
					content: `
      <p>Ao acessar ou usar o Gestão de Gastos (o "Serviço"), você concorda em cumprir e estar vinculado a estes Termos de Uso ("Termos"). Se você não concordar com estes Termos, por favor, não utilize o Serviço.</p>
    `,
				},
				{
					title: 'Alterações nos Termos',
					content: `
      <p>Reservamo-nos o direito de atualizar ou modificar estes Termos a qualquer momento, sem aviso prévio. Seu uso contínuo do Serviço após tais alterações constitui sua aceitação dos novos Termos. Recomendamos revisar os Termos periodicamente.</p>
    `,
				},
				{
					title: 'Contas de Usuário',
					content: `
      <p>Para acessar certos recursos do Serviço, você pode precisar criar uma conta. Você é responsável por manter a confidencialidade das informações da sua conta e por todas as atividades realizadas sob ela. Concorda em notificar-nos imediatamente sobre qualquer uso não autorizado da sua conta.</p>
    `,
				},
				{
					title: 'Serviços Oferecidos',
					content: `
      <p>O Gestão de Gastos oferece ferramentas e recursos para ajudá-lo a registrar e gerenciar suas despesas mensais, incluindo pagamentos à vista e parcelados, além de fornecer insights e dicas para uma melhor gestão financeira.</p>
    `,
				},
				{
					title: 'Conduta do Usuário',
					content: `
      <p>Você concorda em usar o Serviço apenas para fins legais e de acordo com estes Termos. Você não deve:</p>
      <ul>
        <li>Violar quaisquer leis ou regulamentos aplicáveis.</li>
        <li>Infringir os direitos de terceiros.</li>
        <li>Interferir ou interromper o Serviço ou seus servidores.</li>
        <li>Tentar obter acesso não autorizado a qualquer parte do Serviço.</li>
      </ul>
    `,
				},
				{
					title: 'Política de Privacidade',
					content: `
      <p>O uso do Serviço também é regido pela nossa Política de Privacidade, que detalha a coleta, uso e divulgação de suas informações pessoais. Por favor, revise a Política de Privacidade para entender nossas práticas.</p>
    `,
				},
				{
					title: 'Propriedade Intelectual',
					content: `
      <p>Todo o conteúdo, recursos e funcionalidades do Serviço são propriedade do Gestão de Gastos, seus licenciadores ou outros provedores e são protegidos por leis de propriedade intelectual. Você não pode reproduzir, distribuir ou criar trabalhos derivados de qualquer conteúdo sem nossa permissão expressa por escrito.</p>
    `,
				},
				{
					title: 'Isenções de Responsabilidade',
					content: `
      <p>O Serviço é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas. O Gestão de Gastos não garante que o Serviço será ininterrupto, livre de erros ou isento de vírus ou outros componentes prejudiciais.</p>
      <p>As informações fornecidas pelo Serviço são apenas para fins informativos e não constituem aconselhamento financeiro profissional. Você deve consultar um consultor financeiro qualificado antes de tomar decisões financeiras.</p>
    `,
				},
				{
					title: 'Limitação de Responsabilidade',
					content: `
      <p>Na extensão máxima permitida por lei, o Gestão de Gastos não será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, ou por qualquer perda de lucros, dados ou outras perdas intangíveis, decorrentes do uso ou incapacidade de usar o Serviço.</p>
    `,
				},
				{
					title: 'Término',
					content: `
      <p>Podemos encerrar ou suspender seu acesso ao Serviço a qualquer momento, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo se você violar estes Termos.</p>
    `,
				},
				{
					title: 'Lei Aplicável',
					content: `
      <p>Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem consideração aos seus princípios de conflito de leis.</p>
    `,
				},
				{
					title: 'Informações de Contato',
					content: `
      <p>Se você tiver dúvidas ou preocupações sobre estes Termos, entre em contato conosco em nuorim.contato@gmail.com.</p>
    `,
				},
				{
					title: 'Dados do Usuário',
					content: `
      <p>Você mantém a propriedade de quaisquer dados fornecidos ao Serviço. Ao usar o Serviço, você concede ao Gestão de Gastos uma licença mundial, não exclusiva e isenta de royalties para usar, armazenar e processar seus dados exclusivamente para fornecer o Serviço.</p>
    `,
				},
				{
					title: 'Requisitos de Idade',
					content: `
      <p>O Serviço não é destinado a indivíduos menores de 13 anos. Se você tem menos de 13 anos, não use o Serviço. Se você tem menos de 18 anos, pode usar o Serviço apenas com o consentimento de um pai ou responsável.</p>
    `,
				},
				{
					title: 'Segurança de Dados',
					content: `
      <p>Implementamos medidas de segurança razoáveis para proteger seus dados. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é completamente seguro, e não podemos garantir segurança absoluta.</p>
    `,
				},
				{
					title: 'Precisão das Informações',
					content: `
      <p>Você é responsável por garantir que todas as informações fornecidas ao Serviço sejam precisas e atualizadas. O Gestão de Gastos não é responsável por erros ou omissões nos dados fornecidos.</p>
    `,
				},
			]
		}
	},

	methods: {
	},

	computed: {
		indiceItems() {
			return [{
				label: "Índice",
				key: "indice",
				icon: 'pi pi-angle-right',
				items: this.sections.map((section, index) => ({
					label: index + 1 + ". " + section.title,
					key: (index + 1).toString(),
				}))
			}];
		}
	}
}
</script>
<template>
	<div class="container my-5">
		<div class="row justify-content-center">
			<div class="col-12 col-md-8">
				<article aria-labelledby="termos-title">
					<h1 id="termos-title" class="mb-4">Termos de Uso</h1>
					<p class="text-muted mb-5">Última Atualização: 15/06/2025</p>

					<!-- Índice de Navegação -->
					<PanelMenu :model="indiceItems" :expandedKeys="expandedKeys"
						@update:expandedKeys="val => expandedKeys = val" class="mb-5">
						<template #item="slotProps">
							<div class="d-flex align-items-center px-4 py-2 cursor-pointer">
								<i v-if="slotProps.item.icon"
									:class="['pi', 'mr-2', expandedKeys['indice'] ? 'pi-angle-down' : 'pi-angle-right']"></i>
								<a :href="`#section-id-${slotProps.item.key}`" v-ripple>{{ slotProps.item.label }}</a>
							</div>
						</template>
					</PanelMenu>

					<!-- Seções dos Termos -->
					<section v-for="(section, index) in sections" :key="index" :id="`section-id-${index + 1}`"
						class="mb-4" :aria-labelledby="`section-title-${index + 1}`">
						<h2 :id="`section-title-${index + 1}`" class="h4 mb-3">{{ section.title }}</h2>
						<div v-html="section.content"></div>
					</section>
				</article>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use '@/assets/base.scss' as *;

.container {
	padding-top: 2rem;
	padding-bottom: 2rem;
}

h1 {
	font-family: $app-font;
	color: $app-primary-color;
	font-weight: 700;
}

h2 {
	color: $app-primary-color;
	font-weight: 600;
}

.toc {
	border: 1px solid rgba($app-primary-color, 0.2);
}

.toc a {
	transition: color 0.3s;

	&:hover {
		// color: darken($app-primary-color, 10%);
	}
}

section {

	p,
	ul {
		font-family: $app-font;
		color: #333;
		line-height: 1.6;
	}

	ul {
		padding-left: 1.5rem;
	}
}
</style>