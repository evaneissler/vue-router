import { createRouter, createWebHistory } from "vue-router";

// Import components to route to
import Home from '@/views/Home.vue'
import BlogPosts from "@/views/BlogPosts.vue";
import About from "@/views/About.vue";

// Create a router instance
const router = createRouter({
    // Provide history implementation to use
    history: createWebHistory(),
    // Define routes, each route maps to a component
    routes: [
        { path: '/', name: 'home',component: Home },
        { path: '/blogPosts', name: 'blogPosts', component: BlogPosts },
        { path: '/about', name: 'about', component: About }
    ]
})

// Export router instance
export default router
