import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import OrdersPage from '@/pages/OrdersPage.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  return !!token;
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth/login',
      component: LoginPage
    },
    {
      path: '/auth/register',
      component: RegisterPage
    },
    {
      path: '/auth/reset-password',
      component: ResetPasswordPage
    },
    {
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: DashboardPage
        },
        {
          path: 'orders',
          name: 'Orders',
          component: OrdersPage
        },
        {
          path: '',
          name: 'DashboardRedirect',
          redirect: '/dashboard'
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authRequiredRoutes = ['Dashboard', 'Orders'];

  if (authRequiredRoutes.includes(to.name) && !isAuthenticated()) {
    next({ path: '/auth/login' });
  } else {
    next();
  }
});

export default router;