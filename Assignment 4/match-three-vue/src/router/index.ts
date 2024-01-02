import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login
    },
    {
      path: '/game/:id?',
      name: 'game',
      props: true,
      component: () => import('../components/Game.vue')
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../components/Games.vue')
    },
    {
      path: '/highscores',
      name: 'highscores',
      component: () => import('../components/HighScores.vue')
    }
  ]
})

export default router
