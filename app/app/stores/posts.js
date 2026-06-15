import { defineStore } from "pinia";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [],
    filteredPosts: [],
    searchQuery: "",
  }),

  actions: {
    setPosts(posts) {
      this.posts = posts;
      this.filteredPosts = posts;
    },

    removePost(postId) {
      this.posts = this.posts.filter((post) => post.id !== postId);
      this.filteredPosts = this.filteredPosts.filter((post) => post.id !== postId);
    },

    filterPosts(query) {
      this.searchQuery = query;

      if (!query) {
        this.filteredPosts = this.posts;
        return;
      }

      this.filteredPosts = this.posts.filter((post) => {
        const username = post.profiles?.username?.toLowerCase() || "";
        const caption = post.caption?.toLowerCase() || "";
        const search = query.toLowerCase();
        return username.includes(search) || caption.includes(search);
      });
    },
  },
});
