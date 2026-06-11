// https://nuxt.com/docs/api/configuration/nuxt-config
/* export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseUrl: "https://fkzvkjtouhauzjknnshl.supabase.co",
      supabaseKey: "sb_publishable_h4oJWnLLg_eN2PARpi7I7Q_3wSu0X18",
    },
  },
})
 */

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase', 'v-gsap-nuxt'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', 'login', '/signup'],
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