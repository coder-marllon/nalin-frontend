import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import ProductsView from "../views/ProductsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/produtos",
      name: "produtos",
      component: ProductsView,
      meta: { requiresAuth: true },
    },
  ],
});

// 🔐 proteção de rota
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/");
  } else {
    next();
  }
});

export default router;
