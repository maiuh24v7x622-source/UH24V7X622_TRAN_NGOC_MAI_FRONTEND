<template>
<nav class="navbar navbar-expand navbar-dark bg-dark">
  <a href="/" class="navbar-brand">
    Ứng dụng Quản lý danh bạ
  </a>
  <div class="mr-auto navbar-nav" v-if="isLoggedIn">
    <li class="nav-item">
      <router-link
        :to="{ name: 'contactbook' }"
        class="nav-link"
      >
        Danh bạ
        <i class="fas fa-address-book"></i>
      </router-link>
    </li>
  </div>
  <div class="ml-auto navbar-nav">
    <li v-if="isLoggedIn" class="nav-item d-flex align-items-center">
      <span class="nav-link">{{ userEmail }}</span>
      <button class="btn btn-outline-light btn-sm ml-2" @click="logout">Đăng xuất</button>
    </li>
    <li v-else class="nav-item">
      <router-link :to="{ name: 'login' }" class="nav-link">Đăng nhập</router-link>
    </li>
  </div>
</nav>
</template>

<script>
import authService from "@/services/auth.service";
export default {
  name: "AppHeader",
  data() {
    return {
      isLoggedIn: authService.isLoggedIn(),
      userEmail: ""
    };
  },
  created() {
    this.setUserEmail();
  },
  watch: {
    $route() {
      this.isLoggedIn = authService.isLoggedIn();
      this.setUserEmail();
    }
  },
  methods: {
    logout() {
      authService.logout();
      this.isLoggedIn = false;
      this.userEmail = "";
      this.$router.push({ name: "login" });
    },
    setUserEmail() {
      const token = authService.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.userEmail = payload.email || "";
        } catch {
          this.userEmail = "";
        }
      } else {
        this.userEmail = "";
      }
    }
  }
};
</script>