import DocLayout from '@/layouts/DocLayout.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const DocSectionView = () => import('@/views/DocSectionView.vue')

const routes = [
  {
    path: '/',
    component: DocLayout,
    children: [
      {
        path: '',
        redirect: '/docs/introduction',
      },
      {
        path: 'docs/:slug',
        name: 'doc-section',
        component: DocSectionView,
        props: true,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 }
    }
    return { top: 0 }
  },
})

export default router
