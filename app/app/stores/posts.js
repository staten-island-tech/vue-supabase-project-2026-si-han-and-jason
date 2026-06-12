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
