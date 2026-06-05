<template>
  <div class="page">
    <div class="bigtext">Sign Up</div>

    <div class="medtext">Email:</div>
    <input class="textbox" placeholder="Email" v-model="email" />

    <div class="medtext">Password:</div>
    <input
      class="textbox"
      type="password"
      placeholder="Password"
      v-model="password"
    />

    <button class="signupbutton" @click="signup">Sign Up</button>

    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
    <div v-if="successMsg" class="success">{{ successMsg }}</div>

    <div class="logintext">
      Already have an account?
      <nuxt-link to="/login">Login</nuxt-link>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();

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

  successMsg.value = "Account created! You can now log in.";
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
.signupbutton {
  height: 40px;
  width: 75px;
  margin-top: 15px;
  font-size: 15px;
  color: white;
  background-color: green;
  border-radius: 5px;
}
.logintext {
  margin-top: 15px;
  font-size: 15px;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>
