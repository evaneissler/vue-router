import { createRouter, createWebHistory } from 'vue-router'

import { isAuthenticated } from '@/apis/auth'

// Create a router instance
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    const scrollBehaviorOptions = {
      top: 0,
      behavior: 'smooth',
    }

    if (to.meta.scrollToElement) {
      scrollBehaviorOptions.el = to.meta.scrollToElement
    }

    return savedPosition ?? scrollBehaviorOptions
  },
  routes: [
    {
      path: '/',
      name: 'mainLayout',
      component: () => import('@/views/MainLayout.vue'),
      redirect: { name: 'home' },
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/Home.vue'),
          meta: { requiresAuth: false },
        },
        {
          path: '/blogPosts',
          name: 'blogPosts',
          component: () => import('@/views/BlogPosts.vue'),
          meta: {
            enterAnimation: 'animate__animated animate__bounceIn',
            leaveAnimation: 'animate__animated animate__bounceOut',
          },
          redirect: { name: 'blogPostsGreeting' },
          children: [
            {
              path: '',
              name: 'blogPostsGreeting',
              component: () => import('@/views/BlogPostsGreeting.vue'),
              meta: { requiresAuth: false },
            },
            {
              path: '/blogPosts/:id(\\d+)',
              name: 'blogPost',
              components: {
                default: () => import('@/views/BlogPost.vue'),
                sidebar: () => import('@/views/Ads.vue'),
              },
              meta: {
                requiresAuth: true,
                scrollToElement: '.blog-posts-layout',
              },
            },
          ],
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/About.vue'),
          meta: { requiresAuth: false },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/NotFound.vue'),
      meta: { requiresAuth: false },
    },
  ],
})

router.beforeEach((to, from) => {
  console.log(from.name, '->', to.name)
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

router.afterEach((to, from) => {
  console.log(`Successfully navigated to: ${to.fullPath}`)
})

export default router