<template>
  <div class="redirecting-page">
    <p>Checking auth...</p>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const router = useRouter();

watch(
  user,
  (value) => {
    if (value) {
      router.push("/feed");
    } else {
      router.push("/login");
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.redirecting-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: system-ui, sans-serif;
  color: #111;
}
</style>
