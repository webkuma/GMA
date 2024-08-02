import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
const path = process.env.NODE_ENV === 'production' ? '/GMA/' : ''
const router = createRouter({
  history: createWebHistory(path),
  // history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/Awards/:year',
      name: 'Awards',
      component: () => import('../views/AwardsView.vue'),
    },
    {
      path: '/Awards/:year/:awards',
      name: 'AwardsDetail',
      component: () => import('../views/AwardsDetailView.vue'),
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
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin.vue')
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
