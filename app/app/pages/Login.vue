<template>
  <main class="page">
    <header>
      <h1 class="bigtext">Login</h1>
    </header>

    <section class="form">
      <label for="email" class="medtext">Email:</label>
      <input
        id="email"
        class="textbox"
        placeholder="Email"
        v-model="email"
        type="email"
      />

      <label for="password" class="medtext">Password:</label>
      <input
        id="password"
        class="textbox"
        type="password"
        placeholder="Password"
        v-model="password"
      />

      <button class="loginbutton" @click="login">Login</button>

      <p v-if="errorMsg" class="errormsg" role="alert">{{ errorMsg }}</p>

      <p class="signuptext">
        Don't have an account?
        <nuxt-link to="/signup">Sign Up</nuxt-link>
      </p>
    </section>
  </main>
</template>

<script setup>
const supabase = useSupabaseClient();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMsg = ref("");

async function login() {
  if (!email.value || !password.value) {
    errorMsg.value = "Please fill in all fields";
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMsg.value = error.message;
  } else {
    router.push("/feed");
  }
}
</script>

<style scoped>
.page {
  width: 300px;
}
.bigtext {
  font-size: 40px;
  margin-bottom: 20px;
}
.medtext {
  display: block;
  font-size: 25px;
}
.textbox {
  height: 20px;
  width: 250px;
  margin-bottom: 10px;
}
.loginbutton {
  height: 40px;
  width: 75px;
  margin-top: 15px;
  font-size: 15px;
  color: white;
  background-color: green;
  border-radius: 5px;
}
.errormsg {
  color: red;
  margin-top: 10px;
}
.signuptext {
  margin-top: 15px;
  font-size: 15px;
}
</style>
