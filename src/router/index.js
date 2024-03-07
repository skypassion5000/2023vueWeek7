import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Front',
    component: () => import('../views/FrontView.vue'),
    children: [
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/NotFound.vue'),
      },
      {
        path: '',
        name: 'Home',
        component: () => import('../views/HomeView.vue'),
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/AboutView.vue'),
      },
      {
        path: 'products',
        component: () => import('../views/ProductsView.vue'),
      },
      {
        path: 'cart',
        component: () => import('../views/CartView.vue'),
      },
      {
        path: 'blog',
        component: () => import('@/views/UserBlog.vue'),
      },
      {
        path: 'article/:articleId',
        component: () => import('@/views/UserArticle.vue'),
      },
      {
        path: 'checkout/:orderId',
        component: () => import('@/views/UserCheckout.vue'),
      },
      {
        path: 'product/:productId',
        component: () => import('@/views/UserProduct.vue'),
      },
    ],
  },
  {
    path: '/login', // 不要導覽頁
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: () => import('../views/dashboard/DashboardView.vue'),
    children: [
      {
        path: 'products',
        component: () => import('../views/dashboard/ProductsView.vue'),
      },
      {
        path: 'order',
        component: () => import('../views/dashboard/OrderView.vue'),
      },
      {
        path: 'coupon',
        component: () => import('../views/dashboard/CouponView.vue'),
      },
      {
        path: 'blog',
        component: () => import('../views/dashboard/ArticleView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes,
});

export default router;
