<template>
  <div class="page">
    <h4>Đăng nhập</h4>

    <div class="form-group">
      <input
        v-model="username"
        placeholder="Username"
        class="form-control"
      />
    </div>

    <div class="form-group">
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        class="form-control"
      />
    </div>

    <button class="btn btn-primary" @click="login">
      Đăng nhập
    </button>

    <p>{{ message }}</p>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {

  data() {
    return {
      username: "",
      password: "",
      message: ""
    };
  },

  methods: {

    async login() {

      this.message = "";

      try {

        const response = await AuthService.login({
          email: this.username,
          password: this.password
        });

        localStorage.setItem("user", JSON.stringify(response.data));

        this.$router.push({ name: "contactbook" });
        window.location.reload();

      } catch (error) {

        this.message = "Đăng nhập thất bại";

      }

    }

  }

};
</script>