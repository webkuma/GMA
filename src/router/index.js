import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/',
      redirect: { name: 'home' }
    },
    {
      path: '/Awards/:year',
      name: 'Awards',
      component: () => import('../views/AwardsView.vue')
    },
    {
      path: '/Search',
      name: 'Search',
      component: () => import('../views/SearchView.vue')
    },
    {
      path: '/Favorite',
      name: 'Favorite',
      component: () => import('../views/FavoriteView.vue')
    },
    {
    path: '/404',
    name: '404',
    component: HomeView
    // component: () => import('@/pages/404')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
]
})

export default router
