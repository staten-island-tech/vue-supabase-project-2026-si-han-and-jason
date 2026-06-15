<template>
  <main class="page">
    <header>
      <h1 class="bigtext">Create Post</h1>
    </header>

    <section class="form">
      <label for="imageUrl" class="medtext">Image URL:</label>
      <input
        id="imageUrl"
        class="textbox"
        placeholder="Paste image URL"
        v-model="imageUrl"
      />

      <label for="caption" class="medtext">Caption:</label>
      <input
        id="caption"
        class="textbox"
        placeholder="Write a caption"
        v-model="caption"
      />

      <button class="postbutton" @click="createPost">Post</button>

      <p v-if="errorMsg" class="errormsg" role="alert">{{ errorMsg }}</p>
      <p v-if="successMsg" class="successmsg" role="status">{{ successMsg }}</p>
    </section>
  </main>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

watch(
  user,
  (value) => {
    if (!value) {
      navigateTo("/login");
    }
  },
  { immediate: true },
);

const imageUrl = ref("");
const caption = ref("");
const errorMsg = ref("");
const successMsg = ref("");

async function createPost() {
  if (!imageUrl.value || !caption.value) {
    errorMsg.value = "Please fill in all fields";
    return;
  }

  const { error } = await supabase.from("posts").insert({
    user_id: user.value.sub,
    image_url: imageUrl.value,
    caption: caption.value,
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
  display: block;
  font-size: 25px;
}
.textbox {
  height: 20px;
  width: 250px;
  margin-bottom: 10px;
}
.postbutton {
  height: 40px;
  width: 100px;
  margin-top: 15px;
  font-size: 15px;
  color: white;
  background-color: green;
  border-radius: 5px;
}
.errormsg {
  color: red;
  margin-top: 10px;
}
.successmsg {
  color: green;
  margin-top: 10px;
}
</style>
