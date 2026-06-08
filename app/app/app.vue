<template>
  <div v-if="showWelcome" class="welcome">
    <div class="bar-container">
      <div class="bar-fill" :style="{ width: showWelcomeText + '%' }"></div>
    </div>

    <h1 class="welcome-title">{{ loadingText }}</h1>
  </div>

  <div v-if="!showWelcome" class="flex">
    <div class="sidebar">
      <nuxt-link class="textdecornone" to="/">
        <div class="mainheader">Fake Instagram</div>
      </nuxt-link>

      <nuxt-link class="textdecornone" to="/feed">
        <div class="navigation">Feed</div>
      </nuxt-link>

      <nuxt-link class="textdecornone" to="/create">
        <div class="navigation">Create Post</div>
      </nuxt-link>

      <div v-if="user" class="userinfo">
        <div class="navigation">{{ user.email }}</div>
        <button class="logoutbutton" @click="logout">Logout</button>
      </div>
      <nuxt-link v-else class="textdecornone" to="/login">
        <div class="navigation">Login</div>
      </nuxt-link>
    </div>

    <div class="page">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const showWelcome = ref(true);
const showWelcomeText = ref(0);
const loadingText = ref("0%");

onMounted(() => {
  let progress = 0;
  let speed = 10;

  const animate = () => {
    if (progress >= 100) {
      setTimeout(() => {
        loadingText.value = "Welcome!";

        setTimeout(() => {
          showWelcome.value = false;
        }, 1500);
      }, 500);

      return;
    }

    progress += 1;
    showWelcomeText.value = progress;
    loadingText.value = progress + "%";

    if (progress < 92) {
      speed = 8;
    } else {
      speed = 120;
    }

    setTimeout(animate, speed);
  };

  animate();
});

async function logout() {
  await supabase.auth.signOut();
  router.push("/login");
}
</script>

<style>
body {
  margin: 0px;
  background-color: black;
}
</style>

<style scoped>
@import "https://fonts.googleapis.com/css2?family=Cormorant+Unicase:wght@300;400;500;600;700&display=swap";

.welcome {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.welcome-title {
  font-size: 50px;
  font-family: "Cormorant Unicase", serif;
  color: white;
  margin: 0 0 20px 0;
}

.bar-container {
  width: 100%;
  height: 6px;
  background-color: #222;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 30px;
}

.bar-fill {
  height: 100%;
  background-color: white;
  transition: width 0.1s linear;
}

.enterbutton {
  padding: 10px 24px;
  font-size: 16px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s ease;
}

.enterbutton:hover {
  background-color: #e0e0e0;
}

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
