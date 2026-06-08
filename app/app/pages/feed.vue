<template>
  <div class="feed">
    <!-- Search bar for filtering posts -->
    <input
      class="searchbar"
      placeholder="Search by username or caption..."
      v-model="searchQuery"
      @input="postsStore.filterPosts(searchQuery)"
    />

    <div v-if="postsStore.filteredPosts.length === 0">No posts found!</div>

    <div class="post" v-for="post in postsStore.filteredPosts" :key="post.id">
      <!-- Profile info -->
      <div class="posthead">
        <img
          class="avatar"
          :src="post.profiles?.avatar_url || '/images/defaulticon.jpg'"
        />
        <span class="username">{{
          post.profiles?.username || "Unknown User"
        }}</span>

        <!-- Delete button only shows on your own posts -->
        <button
          v-if="user && String(post.user_id) === String(user.sub)"
          class="deletebutton"
          @click="deletePost(post)"
        >
          🗑️ Delete
        </button>
      </div>

      <!-- Post image -->
      <img class="postimage" :src="post.image_url" />

      <!-- Caption -->
      <p class="caption">{{ post.caption }}</p>

      <!-- Like button -->
      <div class="actions">
        <button
          class="likebutton"
          :class="{ liked: isLiked(post) }"
          @click="toggleLike(post)"
          :disabled="!user"
        >
          {{ isLiked(post) ? "❤️" : "🤍" }} {{ post.likes?.length || 0 }} likes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePostsStore } from "~/stores/posts";
import { useAuthStore } from "~/stores/auth";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const postsStore = usePostsStore();
const authStore = useAuthStore();
const searchQuery = ref("");

async function fetchPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      image_url,
      caption,
      created_at,
      user_id,
      profiles (
        username,
        avatar_url
      ),
      likes (id, user_id),
      comments (id)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) console.log("Feed error:", error.message);

  // Save posts to the Pinia store
  postsStore.setPosts(data || []);
}

function isLiked(post) {
  if (!user.value?.sub) return false;
  if (!post.likes || post.likes.length === 0) return false;
  return post.likes.some(
    (like) => String(like.user_id) === String(user.value.sub),
  );
}

async function toggleLike(post) {
  if (!user.value?.sub) return;

  const alreadyLiked = isLiked(post);

  if (alreadyLiked) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", post.id)
      .eq("user_id", user.value.sub);

    if (error) {
      console.log("Unlike error:", error.message);
      return;
    }
  } else {
    const { error } = await supabase.from("likes").insert({
      post_id: post.id,
      user_id: user.value.sub,
    });

    if (error) {
      console.log("Like error:", error.message);
      return;
    }
  }

  await fetchPosts();
}

async function deletePost(post) {
  const confirm = window.confirm("Are you sure you want to delete this post?");
  if (!confirm) return;

  await supabase.from("likes").delete().eq("post_id", post.id);
  await supabase.from("comments").delete().eq("post_id", post.id);

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", post.id)
    .eq("user_id", user.value.sub);

  if (error) {
    console.log("Delete error:", error.message);
    return;
  }

  await fetchPosts();
}

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  await fetchPosts();
});
</script>

<style scoped>
.feed {
  width: 500px;
  margin: 0 auto;
}
.searchbar {
  width: 100%;
  height: 35px;
  margin-bottom: 20px;
  padding: 0 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-sizing: border-box;
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
.deletebutton {
  margin-left: auto;
  background: none;
  border: 1px solid red;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 12px;
  color: red;
  cursor: pointer;
}
.deletebutton:hover {
  background-color: #fff0f0;
}
.postimage {
  width: 100%;
}
.caption {
  padding: 10px;
}
.actions {
  padding: 0 10px 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.likebutton {
  background: none;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.likebutton.liked {
  border-color: red;
  color: red;
  background-color: #fff0f0;
}
.likebutton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
