import { useAutenticacaoStore } from '@/stores/autenticacao.store'
import LoginView from '@/views/login/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      meta: { requiresGuest: true },
      component: LoginView,
    },
    {
      path: '/registro',
      name: 'registro',
      meta: { requiresGuest: true },
      component: () => import('../views/registro/RegistroView.vue'),
    },
    {
      path: '/usuario',
      meta: { requiresAuth: true },
      component: () => import('../views/usuario/UsuarioView.vue'),
      children: [
        {
          path: '',
          redirect: '/perfil',
        },
        {
          path: '/perfil',
          name: 'perfil',
          meta: { ico: 'pi pi-user' },
          component: () => import('../views/usuario/abas/PerfilTab.vue'),
        },
        // {
        //   path: '/perfil',
        //   name: 'perfil',
        //   meta: { ico: 'pi pi-user' },
        //   component: () => import('../views/usuario/abas/PerfilTab.vue'),
        // },
        {
          path: '/configuracoes',
          name: 'configuracoes',
          meta: { ico: 'pi pi-cog' },
          component: () => import('../views/usuario/abas/ConfiguracoesTab.vue'),
        },
        // {
        //   path: '/suporte',
        //   name: 'suporte',
        //   meta: { ico: 'pi pi-question-circle' },
        //   component: () => import('../views/usuario/abas/SuporteTab.vue'),
        // }
      ],
    },
    {
      path: '/sistema',
      name: 'sistema',
      meta: { requiresAuth: true, secao: 'Planejamento' },
      component: () => import('../views/painel/SistemaView.vue'),
      children: [
        {
          path: '/painel',
          name: 'painel',
          meta: { ico: 'pi pi-home' },
          component: () => import('../views/painel/abas/PainelTab.vue'),
        },
        {
          path: '/calendario',
          name: 'calendario',
          meta: { ico: 'pi pi-calendar' },
          component: () => import('../views/painel/abas/CalendarioTab.vue'),
        },
        {
          path: '/categorias',
          name: 'categorias',
          meta: { ico: 'pi pi-tag' },
          component: () => import('../views/painel/abas/CategoriaTab.vue'),
        },
      ],
    },
    {
      path: '/informacoes-legais',
      name: 'informacoes-legais',
      meta: { secao: 'Legal', requiresAuth: false, requiresGuest: false },
      component: () => import('../views/informacoes-legais/InfoLegaisView.vue'),
      children: [
        {
          path: 'termos-de-uso',
          name: 'termos-de-uso',
          meta: { ico: 'pi pi-file' },
          component: () => import('../views/informacoes-legais/abas/TermosUsoTab.vue'),
        },
        {
          path: 'politica-de-privacidade',
          name: 'politica-de-privacidade',
          meta: { ico: 'pi pi-lock' },
          component: () => import('../views/informacoes-legais/abas/PoliticaPrivacidadeTab.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const autenticacaoStore = useAutenticacaoStore()
  
  // Verifica se o token expirou antes de cada navegação
  if (autenticacaoStore.accessToken) {
    if (!autenticacaoStore.verificarTokenExpirado()) {
      // Token expirado, redirecionar para login
      next('/')
      return
    }
  }
  
  const isAutenticado = autenticacaoStore.isAuthenticated

  if (to.meta.requiresAuth && !isAutenticado) {
    next('/')
  } else if (to.meta.requiresGuest && isAutenticado) {
    next('/painel')
  } else {
    next()
  }
})

export default router
