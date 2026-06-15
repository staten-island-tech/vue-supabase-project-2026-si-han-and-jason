<template>
  <div v-if="showWelcome" class="welcome-screen flex-c col">
    <h1 class="counter-text serif fw-600">{{ loadingText }}</h1>

    <h1
      class="welcome-title serif fw-600"
      style="opacity: 0; position: absolute"
    >
      Welcome
    </h1>

    <div class="progress-bar">
      <div
        class="progress-fill serif"
        :style="{ width: progressWidth + '%' }"
      ></div>
    </div>
  </div>

  <div v-else class="app-layout">
    <nav class="sidebar">
      <nuxt-link class="brand-link serif fw-600" to="/feed"
        >Instagram</nuxt-link
      >

      <div class="nav-menu">
        <nuxt-link
          v-for="item in navItems"
          :key="item.to"
          class="nav-item flex-a"
          :to="item.to"
          active-class="active"
        >
          <svg class="icon" viewBox="0 0 24 24" v-html="item.svg"></svg>
          <span>{{ item.label }}</span>
        </nuxt-link>
      </div>

      <div class="sidebar-bottom">
        <div v-if="user" class="profile-card flex-a">
          <div class="avatar flex-c fw-600">
            {{ user.email?.charAt(0).toUpperCase() }}
          </div>
          <span class="text-ellipsis">{{ user.email }}</span>

          <button class="btn-logout flex-c fw-600" @click="logout">
            <svg
              class="icon-sm"
              viewBox="0 0 24 24"
              v-html="icons.logout"
            ></svg>
            <span>Logout</span>
          </button>
        </div>

        <nuxt-link
          v-else
          class="nav-item login-item flex-a"
          to="/login"
          active-class="active"
        >
          <svg class="icon" viewBox="0 0 24 24" v-html="icons.login"></svg>
          <span>Login</span>
        </nuxt-link>
      </div>
    </nav>

    <main class="main-content">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { gsap } from "gsap";
import { useAuthStore } from "~/stores/auth";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const authStore = useAuthStore();
const router = useRouter();

const showWelcome = ref(true);
const progressWidth = ref(0);
const loadingText = ref("0%");

interface NavItem {
  label: string;
  to: string;
  svg: string;
}

const navItems: NavItem[] = [
  {
    label: "Feed",
    to: "/feed",
    svg: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  },
  {
    label: "Create Post",
    to: "/create",
    svg: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 12h6"/><path d="M12 9v6"/>',
  },
];

const icons: Record<string, string> = {
  logout:
    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  login:
    '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>',
};

onMounted(() => {
  const p = { val: 0 };
  const tl = gsap.timeline();

  tl.to(p, {
    val: 100,
    duration: 2.2,
    ease: "power3.out",
    onUpdate: () => {
      progressWidth.value = p.val;
      loadingText.value = `${Math.floor(p.val)}%`;
    },
  });

  tl.to(".counter-text, .progress-bar", {
    opacity: 0,
    y: -20,
    duration: 0.4,
    delay: 0.7,
    ease: "power2.in",
  });

  tl.fromTo(
    ".welcome-title",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
    "+=0.5",
  );

  tl.to(".welcome-screen", {
    opacity: 0,
    duration: 0.6,
    delay: 0.8,
    ease: "power2.out",
  });

  tl.call(async () => {
    showWelcome.value = false;
    await nextTick();
    gsap.from(".sidebar", {
      x: -40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
    gsap.from(".main-content", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.15,
      ease: "power3.out",
    });
  });
});

watch(user, (u) => (u ? authStore.setUser(u) : authStore.clearUser()), {
  immediate: true,
});

async function logout(): Promise<void> {
  await supabase.auth.signOut();
  authStore.clearUser();
  router.push("/login");
}
</script>

<style>
:root {
  --bg: #000000;
  --txt: #f5f5f7;
  --txt-mut: #a1a1a6;
  --bdr: #1c1c1e;
  --acc-red: #ff453a;
  --bg-red: #2c0e0e;
  --hov-red: #4a1515;
  --acc-blu: #0a84ff;
  --bg-blu: #0c2540;
  --hov-blu: #409cff;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--txt);
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&display=swap");

.flex-c {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-a {
  display: flex;
  align-items: center;
}
.col {
  flex-direction: column;
}
.serif {
  font-family: "Playfair Display", serif;
}
.fw-600 {
  font-weight: 600;
  color: #ffffff;
}
.text-ellipsis {
  font-size: 14px;
  color: #e5e5ea;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icon,
.icon-sm {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.icon {
  width: 22px;
  height: 22px;
}
.icon-sm {
  width: 18px;
  height: 18px;
}

.app-layout {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 280px;
  border-right: 1px solid var(--bdr);
  padding: 40px 16px 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.main-content {
  flex: 1;
  padding: 44px;
  overflow-y: auto;
}

.welcome-screen {
  position: fixed;
  inset: 0;
  background: var(--bg);
  gap: 24px;
  z-index: 9999;
}
.welcome-screen h1 {
  font-size: 36px;
  letter-spacing: -0.03em;
  margin: 0;
}
.progress-bar {
  width: 100%;
  height: 2px;
  background: var(--bdr);
  border-radius: 1px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #ffffff;
}

.brand-link {
  text-decoration: none;
  margin: 0 0 36px 12px;
  font-style: italic;
  font-size: 28px;
  letter-spacing: -0.01em;
}
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.nav-item {
  gap: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  color: var(--txt-mut);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-item:hover,
.nav-item.active {
  background: var(--bdr);
  color: #ffffff;
}
.nav-item.active {
  font-weight: 600;
}
.sidebar-bottom {
  border-top: 1px solid var(--bdr);
  padding-top: 20px;
}

.profile-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 0 12px;
}
.avatar {
  width: 36px;
  height: 36px;
  background: #2c2c2e;
  border-radius: 50%;
  font-size: 14px;
}
.btn-logout {
  grid-column: span 2;
  gap: 8px;
  font-size: 14px;
  color: var(--acc-red);
  background: var(--bg-red);
  border: none;
  border-radius: 10px;
  height: 40px;
  margin-top: 4px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.1s;
}
.btn-logout:hover {
  background: var(--hov-red);
}
.btn-logout:active {
  transform: scale(0.98);
}
.login-item {
  color: var(--acc-blu);
}
.login-item:hover {
  background: var(--bg-blu);
  color: var(--hov-blu);
}
</style>
