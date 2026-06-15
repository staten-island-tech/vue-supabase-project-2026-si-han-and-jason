<template>
  <div class="post">
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

    <img class="postimage" :src="post.image_url" :alt="post.caption" />

    <p class="caption">{{ post.caption }}</p>

    <p class="stats">{{ likeCount }} likes · {{ commentCount }} comments</p>

    <div class="actions">
      <button
        class="likebutton"
        :class="{ liked: isLiked }"
        @click="$emit('like', post)"
        :disabled="!currentUserId"
      >
        {{ isLiked ? "❤️" : "🤍" }} {{ likeCount }} likes
      </button>

      <button class="commenttoggle" @click="showComments = !showComments">
        💬 {{ showComments ? "Hide" : "Show" }} Comments
      </button>
    </div>

    <div v-if="showComments" class="commentsection">
      <div
        v-if="post.comments && post.comments.length > 0"
        class="commentslist"
      >
        <div v-for="comment in post.comments" :key="comment.id" class="comment">
          <span class="commentuser"
            >{{ comment.profiles?.username || "Unknown" }}:</span
          >
          <span class="commentcontent">{{ comment.content }}</span>

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
  background: #fff;
  border: 1px solid #999;
  border-radius: 20px;
  padding: 8px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #222;
}
.commentsection {
  padding: 12px;
  border-top: 1px solid #ccc;
  background-color: #ffffff;
}
.commentslist {
  margin-bottom: 12px;
}
.comment {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px 12px;
  background: #f6f6f6;
  border: 1px solid #ddd;
  border-radius: 14px;
  color: #111;
  font-size: 15px;
}
.commentuser {
  font-weight: 700;
  color: #111;
}
.commentcontent {
  flex: 1;
  color: #111;
}
.deletecomment {
  background: none;
  border: none;
  color: #c00;
  cursor: pointer;
  font-size: 12px;
}
.nocomments {
  color: #444;
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
