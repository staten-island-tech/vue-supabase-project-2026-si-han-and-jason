<template>
  <div class="page">
    <div class="bigtext">Login</div>

    <div class="medtext">Email:</div>
    <input class="textbox" placeholder="Email" />

    <div class="medtext">Password:</div>
    <input class="textbox" type="password" placeholder="Password" />

    <button class="loginbutton">Login</button>
  </div>
</template>

<script></script>

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
</style>
