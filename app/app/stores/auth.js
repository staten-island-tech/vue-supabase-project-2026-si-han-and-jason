import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),

  actions: {
    setUser(user) {
      this.user = user;
      this.isLoggedIn = !!user;
    },

    clearUser() {
      this.user = null;
      this.isLoggedIn = false;
    },

    getUserId() {
      return this.user?.sub || null;
    },
  },
});
