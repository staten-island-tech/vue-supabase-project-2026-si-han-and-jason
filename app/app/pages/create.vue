<template>
  <div class="page">
    <div class="bigtext">Create Post</div>

    <div class="medtext">Image URL:</div>
    <input class="textbox" placeholder="Paste image URL" v-model="imageUrl" />

    <div class="medtext">Caption:</div>
    <input class="textbox" placeholder="Write a caption" v-model="caption" />

    <button class="postbutton" @click="createPost">Post</button>

    <div v-if="errorMsg" style="color: red">{{ errorMsg }}</div>
    <div v-if="successMsg" style="color: green">{{ successMsg }}</div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

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
    user_id: user.value.sub, // changed from user.value.id
    image_url: imageUrl.value,
    caption: caption.value,
  });

  if (error) {
    errorMsg.value = error.message;
  } else {
    successMsg.value = "Post created!";
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
</style>
