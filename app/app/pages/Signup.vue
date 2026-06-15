<template>
  <main class="signup-page">
    <div class="signup-card">
      <header class="signup-header">
        <h1 class="title">Create Account</h1>
        <p class="subtitle">Sign up to get started with your account</p>
      </header>

      <form @submit.prevent="signup" class="signup-form">
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
            autocomplete="new-password"
          />
        </div>

        <button type="submit" class="signup-button" :disabled="isLoading">
          <span v-if="isLoading">Creating account...</span>
          <span v-else>Sign Up</span>
        </button>

        <TransitionGroup name="fade">
          <p v-if="errorMsg" key="error" class="error-message" role="alert">
            {{ errorMsg }}
          </p>
          <p
            v-if="successMsg"
            key="success"
            class="success-message"
            role="status"
          >
            {{ successMsg }}
          </p>
        </TransitionGroup>

        <p class="login-text">
          Already have an account?
          <nuxt-link to="/login" class="login-link">Login</nuxt-link>
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
const successMsg = ref<string>("");
const isLoading = ref<boolean>(false);

async function signup(): Promise<void> {
  errorMsg.value = "";
  successMsg.value = "";

  if (!email.value || !password.value) {
    errorMsg.value = "Please fill in all fields.";
    return;
  }

  isLoading.value = true;

  try {
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (authError) {
      errorMsg.value = authError.message;
      return;
    }

    if (data?.user) {
      const { error: dbError } = await (
        supabase.from("profiles") as any
      ).insert({
        id: data.user.id,
        username: email.value,
      });

      if (dbError) {
        errorMsg.value = `Account created, but profile setup failed: ${dbError.message}`;
        return;
      }
    }

    successMsg.value = "Sign up successful! Redirecting...";
    await router.push("/feed");
  } catch (err) {
    errorMsg.value = "An unexpected network error occurred.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.signup-page {
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

.signup-card {
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

.signup-header {
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

.signup-form {
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

.signup-button {
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

.signup-button:hover:not(:disabled) {
  background-color: #059669;
}

.signup-button:active:not(:disabled) {
  transform: scale(0.98);
}

.signup-button:disabled {
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

.success-message {
  color: #10b981;
  font-size: 14px;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 10px 12px;
  border-radius: 6px;
  margin: 0;
  text-align: center;
}

.login-text {
  text-align: center;
  font-size: 14px;
  color: #64748b;
  margin: 8px 0 0 0;
}

.login-link {
  color: #10b981;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.login-link:hover {
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
