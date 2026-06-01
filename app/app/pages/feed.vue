<template>
  <div class="feed">
    <div v-if="posts.length === 0">No posts yet!</div>

    <!-- Profile info -->
    <div class="posthead">
      <img
        class="avatar"
        :src="
          post.profiles.avatar_url ||
          'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
        "
      />
      <span class="username">{{ post.profiles.username }}</span>
    </div>

    <img class="postimage" :src="post.image_url" />

    <p class="caption">{{ post.caption }}</p>

    <p class="likes">{{ post.likes.length }} likes</p>

    <p class="comments">{{ post.comments.length }} comments</p>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const posts = ref([]);

const { data } = await supabase
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
