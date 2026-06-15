<template>
  <main class="feed-layout">
    <div class="feed-container">
      <header class="feed-header">
        <h1 class="feed-title">Feed ({{ totalPostsCount }} Global Posts)</h1>

        <form @submit.prevent="handleSearch" class="search-wrapper">
          <svg
            class="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            class="search-bar"
            placeholder="Search by username or caption..."
            v-model="searchQuery"
            @input="handleSearch"
            aria-label="Search posts"
          />
        </form>
      </header>

      <section class="feed-content">
        <div v-if="filteredPosts.length === 0" class="empty-state">
          <p class="empty-text">No posts found!</p>
        </div>

        <div v-else class="posts-list">
          <PostCard
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
            :currentUserId="user?.id || user?.sub"
            @like="toggleLike"
            @delete="deletePost"
            @comment="addComment"
            @deleteComment="deleteComment"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { usePostsStore } from "~/stores/posts";
import { useAuthStore } from "~/stores/auth";

interface Profile {
  username: string;
  avatar_url?: string;
}

interface Like {
  id: string;
  user_id: string;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: Profile;
}

interface Post {
  id: string;
  image_url?: string;
  caption: string;
  created_at: string;
  user_id: string;
  profiles: Profile;
  likes: Like[];
  comments: Comment[];
}

interface CommentPayload {
  post: Post;
  content: string;
}

const supabase = useSupabaseClient() as any;
const user = useSupabaseUser();
const postsStore = usePostsStore();
const authStore = useAuthStore();
const searchQuery = ref<string>("");
const totalPostsCount = ref<number>(0);

const filteredPosts = computed(
  () => (postsStore.filteredPosts || []) as Post[],
);

// SQL Aggregation Requirement: Server-side database row counting
async function fetchTotalPostsCount(): Promise<void> {
  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Aggregation error:", error.message);
    alert(`Failed to sync metrics: ${error.message}`);
    return;
  }

  if (count !== null) {
    totalPostsCount.value = count;
  }
}

// Form & Search Handling Requirement: Logic to prevent empty field execution
function handleSearch(): void {
  const cleanQuery = searchQuery.value.trim();
  if (cleanQuery === "") {
    // Prevent blank execution from breaking filter states, fall back to default empty tracking
    postsStore.filterPosts("");
    return;
  }
  postsStore.filterPosts(cleanQuery);
}

async function fetchPosts(): Promise<void> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      image_url,
      caption,
      created_at,
      user_id,
      profiles (username, avatar_url),
      likes (id, user_id),
      comments (
        id,
        content,
        user_id,
        created_at,
        profiles (username)
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Feed error:", error.message);
    alert(`Could not load feed: ${error.message}`);
    return;
  }

  postsStore.setPosts(data || []);
  await fetchTotalPostsCount(); // Refresh total stats aggregate counter cleanly
}

async function toggleLike(post: Post): Promise<void> {
  const userId = user.value?.id || user.value?.sub;
  if (!userId) return;

  const alreadyLiked = post.likes?.some(
    (like) => String(like.user_id) === String(userId),
  );

  if (alreadyLiked) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", post.id)
      .eq("user_id", userId);

    if (error) {
      console.error("Unlike error:", error.message);
      alert(`Could not remove like: ${error.message}`);
      return;
    }
  } else {
    const { error } = await supabase.from("likes").insert({
      post_id: post.id,
      user_id: userId,
    });

    if (error) {
      console.error("Like error:", error.message);
      alert(`Could not save like: ${error.message}`);
      return;
    }
  }

  await fetchPosts();
}

async function addComment({ post, content }: CommentPayload): Promise<void> {
  const userId = user.value?.id || user.value?.sub;
  if (!userId) return;

  const { error } = await supabase.from("comments").insert({
    post_id: post.id,
    user_id: userId,
    content: content,
  });

  if (error) {
    console.error("Comment error:", error.message);
    alert(`Could not post comment: ${error.message}`);
    return;
  }

  await fetchPosts();
}

async function deleteComment(comment: Comment, post: Post): Promise<void> {
  const userId = user.value?.id || user.value?.sub;
  if (!userId) return;

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", comment.id)
    .eq("user_id", userId);

  if (error) {
    console.error("Delete comment error:", error.message);
    alert(`Could not delete comment: ${error.message}`);
    return;
  }

  await fetchPosts();
}

async function deletePost(post: Post): Promise<void> {
  const userId = user.value?.id || user.value?.sub;
  if (!userId) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this post?",
  );
  if (!confirmDelete) return;

  let result = await supabase.from("likes").delete().eq("post_id", post.id);
  if (result.error) {
    console.error("Delete likes error:", result.error.message);
    alert(`Could not remove likes before deleting post: ${result.error.message}`);
    return;
  }

  result = await supabase.from("comments").delete().eq("post_id", post.id);
  if (result.error) {
    console.error("Delete comments error:", result.error.message);
    alert(`Could not remove comments before deleting post: ${result.error.message}`);
    return;
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", post.id)
    .eq("user_id", userId);

  if (error) {
    console.error("Delete post error:", error.message);
    alert(`Could not remove post: ${error.message}`);
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
.feed-layout {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    sans-serif;
  padding: 40px 20px;
  box-sizing: border-box;
}

.feed-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.feed-header {
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feed-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: #94a3b8;
  pointer-events: none;
}

.search-bar {
  width: 100%;
  height: 44px;
  padding: 0 14px 0 44px;
  font-size: 15px;
  color: #1e293b;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  box-sizing: border-box;
}

.search-bar:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.feed-content {
  display: flex;
  flex-direction: column;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.empty-state {
  text-align: center;
  background: #ffffff;
  padding: 48px 24px;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}

.empty-text {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}
</style>
