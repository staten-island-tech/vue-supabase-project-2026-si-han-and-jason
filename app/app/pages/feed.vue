<template>
  <div class="feed">
    <div v-if="posts.length === 0">No posts yet!</div>

    <div class="post" v-for="post in posts" :key="post.id">
      <!-- Profile info -->
      <div class="posthead">
        <img
          class="avatar"
          :src="post.profiles?.avatar_url || 'https://placekitten.com/50/50'"
        />
        <span class="username">{{
          post.profiles?.username || "Unknown User"
        }}</span>
      </div>

      <!-- Post image -->
      <img class="postimage" :src="post.image_url" />

      <!-- Caption -->
      <p class="caption">{{ post.caption }}</p>

      <!-- Like count -->
      <p class="likes">{{ post.likes?.length || 0 }} likes</p>

      <!-- Comments count -->
      <p class="comments">{{ post.comments?.length || 0 }} comments</p>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const posts = ref([]);

const { data, error } = await supabase
  .from("posts")
  .select(
    `
    id,
    image_url,
    caption,
    created_at,
    profiles (
      username,
      avatar_url
    ),
    likes (id),
    comments (id)
  `,
  )
  .order("created_at", { ascending: false });

if (error) {
  console.log("Feed error:", error.message);
}

posts.value = data || [];
</script>

<style scoped>
.feed {
  width: 500px;
  margin: 0 auto;
}
.post {
  border: 1px solid #ccc;
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}
.posthead {
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 10px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.username {
  font-weight: bold;
}
.postimage {
  width: 100%;
}
.caption {
  padding: 10px;
}
.likes,
.comments {
  padding: 0 10px 10px;
  color: gray;
  font-size: 14px;
}
</style>
