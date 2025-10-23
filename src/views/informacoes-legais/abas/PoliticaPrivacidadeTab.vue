<script lang="ts">
export default {
	data() {
		return {
			expandedKeys: {
				indice: true,
			},
			sections: [
				{
					title: 'Introdução',
					content: `
      <p>Nosso site de Gestão de Gastos preza pela privacidade dos usuários e está comprometido em proteger os dados coletados. Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossos serviços. O uso do site implica na concordância com os termos aqui estabelecidos.</p>
    `,
				},
				{
					title: 'Dados Coletados',
					content: `
      <p>Coletamos apenas os dados pessoais fornecidos voluntariamente pelo usuário para oferecer e melhorar nossos serviços. As informações coletadas incluem:</p>
      <ul>
        <li>Nome completo: Nome e sobrenome do usuário.</li>
        <li>Endereço de e-mail: Utilizado para cadastro e comunicação.</li>
        <li>Número de telefone: Utilizado para autenticação e contato, se necessário.</li>
        <li>Dados sobre a renda mensal: Informações financeiras fornecidas voluntariamente pelo usuário após o login, que ajudam nas recomendações de gestão de despesas.</li>
      </ul>
    `,
				},
				{
					title: 'Finalidade do Uso dos Dados',
					content: `
      <p>As informações coletadas são utilizadas exclusivamente para oferecer as funcionalidades do site e personalizar a experiência do usuário. Por exemplo, usamos seus dados de renda mensal para fornecer sugestões e análises financeiras mais adequadas à sua realidade. Além disso, o e-mail e telefone podem ser utilizados para notificações importantes sobre o serviço ou recuperação de acesso. Em nenhum caso utilizaremos seus dados para finalidades incompatíveis com a prestação dos nossos serviços sem consentimento prévio.</p>
    `,
				},
				{
					title: 'Autenticação',
					content: `
      <p>Para garantir a segurança do acesso, nosso sistema utiliza autenticação baseada em JSON Web Tokens (JWT). Cada usuário cria um login com e-mail e senha criptografada: as senhas são armazenadas de forma segura (por meio de hashing) em nosso servidor, sem possibilidade de leitura direta. Ao efetuar login, é gerado um token de sessão único que mantém o usuário autenticado enquanto estiver navegando pelo site. Esse mecanismo impede que terceiros obtenham acesso indevido à sua conta, mesmo que interceptem informações de login.</p>
    `,
				},
				{
					title: 'Cookies',
					content: `
      <p>Nosso site faz uso de cookies para melhorar a experiência de navegação. Cookies são pequenos arquivos de texto armazenados pelo navegador no seu dispositivo. Utilizamos cookies de sessão para manter você logado enquanto navega pelas páginas, além de cookies analíticos que nos ajudam a compreender como o site é utilizado. Essas informações nos permitem aprimorar continuamente o serviço. Você pode configurar seu navegador para recusar cookies ou alertá-lo quando um cookie for enviado, mas isso pode afetar o funcionamento de algumas funcionalidades do site, como a manutenção da sessão de login.</p>
    `,
				},
				{
					title: 'Compartilhamento de Dados',
					content: `
      <p>Atualmente, não compartilhamos informações pessoais dos usuários com terceiros para fins comerciais ou publicitários. Seus dados são utilizados apenas internamente pela equipe do site para oferecer os serviços contratados. Em casos excepcionais, podemos compartilhar informações pessoais caso sejamos legalmente obrigados (por exemplo, em resposta a requisições judiciais) ou para proteção dos nossos direitos, garantias e segurança. Ressaltamos que, futuramente, se for decidido compartilhar dados com parceiros ou provedores de serviços, esta política será atualizada e os usuários serão informados sobre qualquer mudança relevante.</p>
    `,
				},
				{
					title: 'Direitos do Titular de Dados',
					content: `
      <p>Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD), você, titular dos dados, possui diversos direitos em relação às suas informações pessoais. Entre eles estão:</p>
      <ul>
        <li>Acesso: solicitar a confirmação da existência e obter acesso às informações pessoais mantidas por nós.</li>
        <li>Retificação: solicitar a correção ou atualização de dados incompletos, inexatos ou desatualizados.</li>
        <li>Exclusão: solicitar a exclusão, anonimização ou bloqueio de dados pessoais desnecessários, excessivos ou tratados em desconformidade com a lei.</li>
        <li>Portabilidade: solicitar a transferência dos dados pessoais que você nos forneceu a outro serviço, quando aplicável.</li>
        <li>Revogação do consentimento: retirar o consentimento dado para o tratamento de dados a qualquer momento, quando o tratamento depender dele.</li>
      </ul>
      <p>Para exercer quaisquer desses direitos ou esclarecer dúvidas sobre o tratamento de seus dados, basta entrar em contato conosco pelo e-mail privacidade@seudominio.com. Atenderemos sua solicitação dentro dos prazos legais estabelecidos e informaremos sobre as providências adotadas.</p>
    `,
				},
				{
					title: 'Medidas de Segurança',
					content: `
      <p>Adotamos medidas técnicas e administrativas adequadas para proteger seus dados pessoais contra acesso não autorizado, perda, destruição ou alteração. Utilizamos criptografia (tanto no armazenamento das senhas quanto no envio de dados sensíveis) e mantemos nossos servidores em ambientes seguros e monitorados. Também empregamos protocolos de segurança padrão do mercado, como comunicação via HTTPS (SSL/TLS), firewalls e políticas de acesso restrito à infraestrutura. Essas práticas são periodicamente revisadas e atualizadas para acompanhar as melhores práticas de segurança da informação.</p>
    `,
				},
				{
					title: 'Alterações nesta Política de Privacidade',
					content: `
      <p>Esta Política de Privacidade pode ser atualizada para refletir mudanças em nossas práticas ou em requisitos legais. Ao ocorrer qualquer alteração significativa, publicaremos a nova versão no site e, se necessário, avisaremos os usuários por e-mail ou outra forma de comunicação. Recomendamos que os usuários revisem esta página regularmente para se manterem informados sobre como protegemos seus dados pessoais.</p>
    `,
				},
				{
					title: 'Contato',
					content: `
      <p>Se você tiver qualquer dúvida, comentário ou solicitação relacionada a esta Política de Privacidade ou ao tratamento de seus dados, entre em contato conosco pelo e-mail privacidade@seudominio.com. Estamos à disposição para esclarecer suas dúvidas e atender suas solicitações, sempre com transparência e respeito à sua privacidade.</p>
    `,
				},
			]
		}
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
				<article aria-labelledby="politica-title">
					<h1 id="politica-title" class="mb-4">Política de Privacidade</h1>
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

					<!-- Seções da Política de Privacidade -->
					<section v-for="(section, index) in sections" :key="index" :id="`section-id-${index + 1}`" class="mb-4"
						:aria-labelledby="`section-title-${index + 1}`">
						<h2 :id="`section-title-${index + 1}`" class="h4 mb-3">{{ section.title }}</h2>
						<div v-html="section.content"></div>
					</section>
				</article>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

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