// https://nuxt.com/docs/api/configuration/nuxt-config
/* export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseUrl: "https://brbnarajxfzxgdmtaxsz.supabase.co",
      supabaseKey: "sb_publishable_kugcCe61KKEOBiHGpiyUgw_DzP4nM5I",
    },
  },
})
 */

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/'],
    }
  }
})