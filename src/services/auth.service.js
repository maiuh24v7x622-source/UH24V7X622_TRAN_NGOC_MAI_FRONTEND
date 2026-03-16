import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/";

class AuthService {
  login(data) {
    return axios.post(API_URL + "login", data);
  }

  logout() {
    localStorage.removeItem("user");
  }

  isLoggedIn() {
    return !!localStorage.getItem("user");
  }

  getToken() {
    const user = localStorage.getItem("user");
    if (!user) return null;
    try {
      return JSON.parse(user).token;
    } catch {
      return null;
    }
  }
}

export default new AuthService();
