<template>
  <main class="login-page">
    <div class="login-card">
      <header class="login-header">
        <h1 class="title">Welcome Back</h1>
        <p class="subtitle">Please enter your details to sign in</p>
      </header>

      <form @submit.prevent="login" class="login-form">
        <div class="input-group">
          <label for="email" class="input-label">Email Address</label>
          <input
            id="email"
            class="input-field"
            placeholder="you@example.com"
            v-model="email"
            type="email"
            autocomplete="email"
          />
        </div>

        <div class="input-group">
          <label for="password" class="input-label">Password</label>
          <input
            id="password"
            class="input-field"
            type="password"
            placeholder="••••••••"
            v-model="password"
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>

        <Transition name="fade">
          <p v-if="errorMsg" class="error-message" role="alert">
            {{ errorMsg }}
          </p>
        </Transition>

        <p class="signup-text">
          Don't have an account?
          <nuxt-link to="/signup" class="signup-link">Sign up</nuxt-link>
        </p>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const router = useRouter();

const email = ref<string>("");
const password = ref<string>("");
const errorMsg = ref<string>("");
const isLoading = ref<boolean>(false);

async function login(): Promise<void> {
  errorMsg.value = "";

  if (!email.value || !password.value) {
    errorMsg.value = "Please fill in all fields.";
    return;
  }

  isLoading.value = true;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMsg.value = error.message;
    } else {
      await router.push("/feed");
    }
  } catch (err) {
    errorMsg.value = "An unexpected error occurred.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    sans-serif;
  padding: 20px;
}

.login-card {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.input-field {
  padding: 10px 14px;
  font-size: 15px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  background-color: #ffffff;
  color: #1e293b;
}

.input-field:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.login-button {
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  background-color: #10b981;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
  margin-top: 8px;
}

.login-button:hover:not(:disabled) {
  background-color: #059669;
}

.login-button:active:not(:disabled) {
  transform: scale(0.98);
}

.login-button:disabled {
  background-color: #a7f3d0;
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  background-color: #fef2f2;
  border: 1px solid #fca5a5;
  padding: 10px 12px;
  border-radius: 6px;
  margin: 0;
  text-align: center;
}

.signup-text {
  text-align: center;
  font-size: 14px;
  color: #64748b;
  margin: 8px 0 0 0;
}

.signup-link {
  color: #10b981;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.signup-link:hover {
  color: #059669;
  text-decoration: underline;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
