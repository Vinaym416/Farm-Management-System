class PostService {
  constructor() {
    this.STORAGE_KEY = 'community_posts';
    // Initialize storage if empty
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  getPosts() {
    const posts = localStorage.getItem(this.STORAGE_KEY);
    return posts ? JSON.parse(posts) : [];
  }

  addPost(post) {
    try {
      const posts = this.getPosts();
      const newPost = {
        ...post,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
        likes_count: 0 // Add this field explicitly
      };
      posts.unshift(newPost);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
      return newPost;
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  }

  likePost(postId, userId) {
    const posts = this.getPosts();
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(userId);
        const updatedPost = {
          ...post,
          likes: hasLiked 
            ? post.likes.filter(id => id !== userId)
            : [...post.likes, userId],
          likes_count: hasLiked 
            ? (post.likes_count || 0) - 1
            : (post.likes_count || 0) + 1,
          likedBy: hasLiked 
            ? (post.likedBy || []).filter(id => id !== userId)
            : [...(post.likedBy || []), userId]
        };
        return updatedPost;
      }
      return post;
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPosts));
    return updatedPosts.find(post => post.id === postId);
  }

  addComment(postId, comment) {
    const posts = this.getPosts();
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: Date.now(),
            ...comment,
            createdAt: new Date().toISOString()
          }]
        };
      }
      return post;
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPosts));
    return updatedPosts.find(post => post.id === postId);
  }

  deletePost(postId) {
    const posts = this.getPosts();
    const updatedPosts = posts.filter(post => post.id !== postId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPosts));
  }
}

export const postService = new PostService();