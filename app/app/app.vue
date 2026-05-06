<template>
  <div class="flex">
    <div class="sidebar">
      <nuxt-link class="textdecornone" to="/">
        <div class="mainheader">Fake Instagram</div>
      </nuxt-link>

      <nuxt-link class="textdecornone" to="/Events">
        <div class="navigation">Events</div>
      </nuxt-link>

      <nuxt-link class="textdecornone" to="/Login">
        <div class="navigation">Login</div>
      </nuxt-link>
    </div>

    <div class="page">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { createClient } from "@supabase/supabase-js";
const config = useRuntimeConfig();
const supabase = createClient(
  "https://brbnarajxfzxgdmtaxsz.supabase.co",
  "sb_publishable_kugcCe61KKEOBiHGpiyUgw_DzP4nM5I",
);
</script>

<style scoped>
.textdecornone {
  text-decoration: none;
}
.sidebar {
  width: 300px;
  background-color: bisque;
  height: 300px;
  max-height: 300px;
}
.mainheader {
  font-size: 40px;
  margin: 20px auto;
}
.navigation {
  font-size: 25px;
  margin: 15px;
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
