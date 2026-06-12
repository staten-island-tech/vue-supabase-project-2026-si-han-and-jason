<template>
  <div class="flex">
    <nav class="sidebar">
      <header>
        <nuxt-link class="textdecornone" to="/feed">
          <div class="mainheader">Fake Instagram</div>
        </nuxt-link>
      </header>

      <section class="navlinks">
        <nuxt-link class="textdecornone" to="/create">
          <div class="navigation">Create Post</div>
        </nuxt-link>

        <div v-if="authStore.isLoggedIn" class="userinfo">
          <div class="navigation">{{ authStore.user?.email }}</div>
          <button class="logoutbutton" @click="logout">Logout</button>
        </div>
        <nuxt-link v-else class="textdecornone" to="/login">
          <div class="navigation">Login</div>
        </nuxt-link>
      </section>
    </nav>

    <main class="page">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const authStore = useAuthStore();
const router = useRouter();

watch(
  user,
  (newUser) => {
    if (newUser) {
      authStore.setUser(newUser);
    } else {
      authStore.clearUser();
    }
  },
  { immediate: true },
);

async function logout() {
  await supabase.auth.signOut();
  authStore.clearUser();
  router.push("/login");
}
</script>
<style>
body {
  margin: 0px;
}
</style>

<style scoped>
.textdecornone {
  text-decoration: none;
}
.sidebar {
  width: 300px;
  background-color: bisque;
  height: 100vh;
}
.mainheader {
  font-size: 40px;
  margin: 20px auto;
}
.navlinks {
  display: flex;
  flex-direction: column;
}
.navigation {
  font-size: 25px;
  margin: 15px;
}
.userinfo {
  margin: 15px;
}
.logoutbutton {
  margin-top: 5px;
  font-size: 14px;
  color: white;
  background-color: red;
  border-radius: 5px;
  height: 30px;
  width: 70px;
  cursor: pointer;
}
.page {
  background-color: yellow;
  margin: 25px auto;
}
.flex {
  display: flex;
  flex: 1;
}
</style>
