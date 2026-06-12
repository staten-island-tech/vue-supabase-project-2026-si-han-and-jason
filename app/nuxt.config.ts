export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase', 'v-gsap-nuxt', '@pinia/nuxt'], 
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/login', '/signup'],
    },
    clientOptions: {
      realtime: {
        params: {
          eventsPerSecond: -1,
        },
      },
    },
  },
})