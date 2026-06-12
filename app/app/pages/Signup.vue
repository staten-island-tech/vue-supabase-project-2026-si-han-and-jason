<template>
  <main class="page">
    <header>
      <h1 class="bigtext">Sign Up</h1>
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

      <button class="signupbutton" @click="signup">Sign Up</button>

      <p v-if="errorMsg" class="errormsg" role="alert">{{ errorMsg }}</p>
      <p v-if="successMsg" class="successmsg" role="status">{{ successMsg }}</p>

      <p class="logintext">
        Already have an account?
        <nuxt-link to="/login">Login</nuxt-link>
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
const successMsg = ref("");

async function signup() {
  if (!email.value || !password.value) {
    errorMsg.value = "Please fill in all fields";
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (error) {
    errorMsg.value = error.message;
    return;
  }

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      username: email.value,
    });
  }

  router.push("/feed");
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
.signupbutton {
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
.successmsg {
  color: green;
  margin-top: 10px;
}
.logintext {
  margin-top: 15px;
  font-size: 15px;
}
</style>
