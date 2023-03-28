import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/components/JoinAirdrop.vue"),
  },
  {
    path: "/claim",
    component: () => import("@/components/ClaimAirdrop.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE),
  routes,
});

export default router;
