<template>
  <div class="feed">
    <input
      class="searchbar"
      placeholder="Search by username or caption..."
      v-model="searchQuery"
      @input="postsStore.filterPosts(searchQuery)"
    />

    <div v-if="postsStore.filteredPosts.length === 0">No posts found!</div>

    <PostCard
      v-for="post in postsStore.filteredPosts"
      :key="post.id"
      :post="post"
      :currentUserId="user?.sub"
      @like="toggleLike"
      @delete="deletePost"
      @comment="addComment"
      @deleteComment="deleteComment"
    />
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
      comments (
        id,
        content,
        user_id,
        created_at,
        profiles (
          username
        )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) console.log("Feed error:", error.message);
  postsStore.setPosts(data || []);
}

async function toggleLike(post) {
  if (!user.value?.sub) return;

  const alreadyLiked = post.likes?.some(
    (like) => String(like.user_id) === String(user.value.sub),
  );

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

async function addComment({ post, content }) {
  if (!user.value?.sub) return;

  const { error } = await supabase.from("comments").insert({
    post_id: post.id,
    user_id: user.value.sub,
    content: content,
  });

  if (error) {
    console.log("Comment error:", error.message);
    return;
  }

  await fetchPosts();
}

async function deleteComment(comment, post) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", comment.id)
    .eq("user_id", user.value.sub);

  if (error) {
    console.log("Delete comment error:", error.message);
    return;
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
</style>
