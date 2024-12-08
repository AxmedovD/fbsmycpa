import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import OrdersPage from '@/pages/OrdersPage.vue'
import ClientsPage from '@/pages/ClientsPage.vue'
import UsersPage from '@/pages/UsersPage.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  console.log("Auth Token:", token); // Debugging output
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
          path: 'clients',
          name: 'Clients',
          component: ClientsPage
        },
        {
          path: 'users',
          name: 'Users',
          component: UsersPage
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

// Move this block after the `router` initialization
router.beforeEach((to, from, next) => {
  console.log("Navigating to:", to.name); // Debugging output
  const authRequiredRoutes = ['Dashboard', 'Orders', 'Clients', 'Users'];

  if (authRequiredRoutes.includes(to.name) && !isAuthenticated()) {
    next({ path: '/auth/login' });
  } else {
    next();
  }
});

export default router;
