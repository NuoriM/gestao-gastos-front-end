import LoginView from '@/views/login/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('../views/registro/RegisterView.vue'),
    },
    {
      path: '/informacoes-legais',
      name: 'informacoes-legais',
      component: () => import('../views/informacoes-legais/InfoLegaisView.vue'),
      children: [
        {
          path: 'termos-de-uso',
          name: 'termos-de-uso',
          component: () => import('../views/informacoes-legais/TermosUsoView.vue'),
        },
        {
          path: 'politica-de-privacidade',
          name: 'politica-de-privacidade',
          component: () => import('../views/informacoes-legais/PoliticaPrivacidadeView.vue'),
        },
      ],
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
