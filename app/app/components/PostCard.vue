<template>
  <div class="post">
    <!-- Profile info -->
    <div class="posthead">
      <img
        class="avatar"
        :src="post.profiles?.avatar_url || 'images/defaulticon.jpg'"
        :alt="post.profiles?.username + ' avatar'"
      />
      <span class="username">{{
        post.profiles?.username || "Unknown User"
      }}</span>

      <button
        v-if="isOwner"
        class="deletebutton"
        @click="$emit('delete', post)"
      >
        🗑️ Delete
      </button>
    </div>

    <!-- Post image -->
    <img class="postimage" :src="post.image_url" :alt="post.caption" />

    <!-- Caption -->
    <p class="caption">{{ post.caption }}</p>

    <!-- Stats -->
    <p class="stats">{{ likeCount }} likes · {{ commentCount }} comments</p>

    <!-- Actions -->
    <div class="actions">
      <!-- Like button -->
      <button
        class="likebutton"
        :class="{ liked: isLiked }"
        @click="$emit('like', post)"
        :disabled="!currentUserId"
      >
        {{ isLiked ? "❤️" : "🤍" }} {{ likeCount }} likes
      </button>

      <!-- Toggle comments -->
      <button class="commenttoggle" @click="showComments = !showComments">
        💬 {{ showComments ? "Hide" : "Show" }} Comments
      </button>
    </div>

    <!-- Comments section -->
    <div v-if="showComments" class="commentsection">
      <!-- Existing comments -->
      <div
        v-if="post.comments && post.comments.length > 0"
        class="commentslist"
      >
        <div v-for="comment in post.comments" :key="comment.id" class="comment">
          <span class="commentuser"
            >{{ comment.profiles?.username || "Unknown" }}:</span
          >
          <span class="commentcontent">{{ comment.content }}</span>

          <!-- Delete comment button only for comment owner -->
          <button
            v-if="String(comment.user_id) === String(currentUserId)"
            class="deletecomment"
            @click="$emit('deleteComment', comment, post)"
          >
            ✕
          </button>
        </div>
      </div>

      <div v-else class="nocomments">No comments yet!</div>

      <!-- Add comment input -->
      <div v-if="currentUserId" class="addcomment">
        <input
          class="commentinput"
          v-model="newComment"
          placeholder="Add a comment..."
          @keyup.enter="submitComment"
        />
        <button class="submitcomment" @click="submitComment">Post</button>
      </div>

      <div v-else class="nocomments">Log in to comment</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  currentUserId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["like", "delete", "comment", "deleteComment"]);

const showComments = ref(false);
const newComment = ref("");

// Computed properties
const likeCount = computed(() => props.post.likes?.length || 0);
const commentCount = computed(() => props.post.comments?.length || 0);
const isLiked = computed(() => {
  if (!props.currentUserId) return false;
  return (
    props.post.likes?.some(
      (like) => String(like.user_id) === String(props.currentUserId),
    ) ?? false
  );
});
const isOwner = computed(() => {
  if (!props.currentUserId) return false;
  return String(props.post.user_id) === String(props.currentUserId);
});

function submitComment() {
  if (!newComment.value.trim()) return;
  emit("comment", { post: props.post, content: newComment.value.trim() });
  newComment.value = "";
}
</script>

<style scoped>
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
.stats {
  padding: 0 10px;
  color: gray;
  font-size: 14px;
}
.actions {
  padding: 10px;
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
.commenttoggle {
  background: none;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.commentsection {
  padding: 10px;
  border-top: 1px solid #eee;
  background-color: #fafafa;
}
.commentslist {
  margin-bottom: 10px;
}
.comment {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  font-size: 14px;
}
.commentuser {
  font-weight: bold;
}
.commentcontent {
  flex: 1;
}
.deletecomment {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 12px;
}
.nocomments {
  color: gray;
  font-size: 14px;
  margin-bottom: 10px;
}
.addcomment {
  display: flex;
  gap: 10px;
}
.commentinput {
  flex: 1;
  height: 30px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 14px;
}
.submitcomment {
  height: 30px;
  padding: 0 15px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}
</style>
