<template>
  <div v-if="showWelcome" class="welcome">
    <div class="bar-container">
      <div class="bar-fill" :style="{ width: showWelcomeText + '%' }"></div>
    </div>

    <h1 class="welcome-title">{{ loadingText }}</h1>
  </div>

  <div v-if="!showWelcome" class="flex"></div>
  <div class="sidebar"></div>
  <nuxt-link class="textdecornone" to="/">
    <div class="mainheader">Fake Instagram</div>
  </nuxt-link>
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
import { ref, onMounted, nextTick } from "vue";
import { gsap } from "gsap";
import { useAuthStore } from "~/stores/auth";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const authStore = useAuthStore();
const router = useRouter();

const showWelcome = ref(true);
const showWelcomeText = ref(0);
const loadingText = ref("0%");

onMounted(() => {
  const progressObj = { value: 0 };
  const tl = gsap.timeline();

  tl.to(progressObj, {
    value: 100,
    duration: 2.5,
    ease: "power2.out",
    onUpdate: () => {
      showWelcomeText.value = progressObj.value;
      loadingText.value = Math.floor(progressObj.value) + "%";
    },
  });

  tl.to(".welcome-title, .bar-container", {
    opacity: 0,
    duration: 0.3,
    delay: 1,
  });

  tl.call(() => {
    loadingText.value = "Welcome!";
  });

  tl.fromTo(
    ".welcome-title",
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.5,
      immediateRender: false,
    },
  );

  tl.to(".welcome", {
    opacity: 0,
    duration: 0.5,
    delay: 0.3,
  });

  tl.call(async () => {
    showWelcome.value = false;
    await nextTick();

    gsap.from(".sidebar, .navigation, .userinfo, .page", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
    });
  });
});
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
