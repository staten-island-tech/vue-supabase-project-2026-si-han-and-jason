<template>
  <div class="sidebar">
    <nuxt-link to="/Home">
      <div class="mainheader">Fake Instagram</div>
    </nuxt-link>

    <nuxt-link to="/Events">
      <div class="navigation">To Events</div>
    </nuxt-link>

    <nuxt-link to="/Login">
      <div class="navigation">Login</div>
    </nuxt-link>
  </div>

  <NuxtPage class="page" />
</template>

<script></script>

<style scoped>
.sidebar {
  width: 300px;
  background-color: bisque;
}
.mainheader {
  font-size: 40px;
  margin: 20px auto;
}
.navigation {
  font-size: 25px;
  margin: 15px;
}
</style>
