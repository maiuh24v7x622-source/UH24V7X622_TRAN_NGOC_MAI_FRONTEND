import { createWebHistory, createRouter } from "vue-router";
import ContactBook from "@/views/ContactBook.vue";
import Login from "@/views/Login.vue";
import NotFound from "@/views/NotFound.vue";
import ContactAdd from "@/views/ContactAdd.vue";
import ContactEdit from "@/views/ContactEdit.vue";
import AuthService from "@/services/auth.service";

const routes = [
  {
    path: "/",
    name: "contactbook",
    component: ContactBook,
  },

  {
    path: "/login",
    name: "login",
    component: Login,
  },

  {
    path: "/contacts/add",
    name: "contact.add",
    component: ContactAdd,
  },
  {
    path: "/contacts/:id/edit",
    name: "contact.edit",
    component: ContactEdit,
    props: true,
  },

  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = AuthService.isLoggedIn();
  if (to.name === "login" && isLoggedIn) {
    // Nếu đã đăng nhập mà vào trang login thì chuyển về contactbook
    next({ name: "contactbook" });
  } else if (to.name !== "login" && !isLoggedIn) {
    // Nếu chưa đăng nhập mà vào trang khác thì chuyển về login
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
