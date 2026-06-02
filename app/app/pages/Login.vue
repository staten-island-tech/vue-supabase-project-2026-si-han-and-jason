<template>
  <div class="page">
    <div class="bigtext">Login</div>

    <div class="medtext">Email:</div>
    <input class="textbox" placeholder="Email" v-model="email" />

    <div class="medtext">Password:</div>
    <input
      class="textbox"
      type="password"
      placeholder="Password"
      v-model="password"
    />

    <button class="loginbutton" @click="login">Login</button>

    <div v-if="errorMsg" style="color: red">{{ errorMsg }}</div>

    <div class="signuptext">
      Don't have an account?
      <nuxt-link to="/signup">Sign Up</nuxt-link>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMsg = ref("");

async function login() {
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
  font-size: 25px;
}
.textbox {
  height: 20px;
  width: 250px;
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
.signuptext {
  margin-top: 15px;
  font-size: 15px;
}
</style>
