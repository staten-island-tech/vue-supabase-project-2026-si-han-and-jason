import { createClient } from "@supabase/supabase-js";

export default defineNuxtPlugin(() => {
  const supabaseUrl = "https://brbnarajxfzxgdmtaxsz.supabase.co";
  const supabaseKey = "sb_publishable_kugcCe61KKEOBiHGpiyUgw_DzP4nM5I";

  const supabase = createClient(supabaseUrl, supabaseKey);

  return {
    provide: {
      supabase,
    },
  };
});
