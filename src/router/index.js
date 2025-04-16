import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import BlogPosts from '@/views/BlogPosts.vue'
import About from '@/views/About.vue'
import BlogPost from '@/views/BlogPost.vue'
import BlogPostsGreeting from '@/views/BlogPostsGreeting.vue'
import NotFound from '@/views/NotFound.vue'
import Ads from '@/views/Ads.vue'
import Login from '@/views/Login.vue'
import MainLayout from '@/views/MainLayout.vue'
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
      component: MainLayout,
      redirect: { name: 'home' },
      children: [
        {
          path: '/home',
          name: 'home',
          component: Home,
          meta: { requiresAuth: false },
        },
        {
          path: '/blogPosts',
          name: 'blogPosts',
          component: BlogPosts,
          meta: {
            enterAnimation: 'animate__animated animate__bounceIn',
            leaveAnimation: 'animate__animated animate__bounceOut',
          },
          redirect: { name: 'blogPostsGreeting' },
          children: [
            {
              path: '',
              name: 'blogPostsGreeting',
              component: BlogPostsGreeting,
              meta: { requiresAuth: false },
            },
            {
              path: '/blogPosts/:id(\\d+)',
              name: 'blogPost',
              components: {
                default: BlogPost,
                sidebar: Ads,
              },
              meta: { requiresAuth: true },
            },
          ],
        },
        {
          path: '/about',
          name: 'about',
          component: About,
          meta: { requiresAuth: false },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound,
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