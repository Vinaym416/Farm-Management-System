import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./components/header";
import { CreatePost } from "./components/createpost";
import { toast } from "react-toastify";
import { postService } from "../../services/postService";

export const Post = ({ 
  post, 
  currentUser, 
  onLike, 
  onComment, 
  onDelete, 
  onClick, 
  isExpanded 
}) => {
  const [comment, setComment] = useState("");

  const handleClick = (e) => {
    e.preventDefault();
    if (!isExpanded && onClick) {
      onClick();
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike(post.id);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(post.id);
  };

  const handleCommentSubmit = (e) => {
    e.stopPropagation();
    if (comment.trim()) {
      onComment(post.id, comment);
      setComment("");
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow p-6 ${!isExpanded && 'cursor-pointer hover:shadow-lg transition-shadow'}`}
      onClick={handleClick}
    >
      {/* Post header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">{post.author?.name || 'Anonymous'}</h3>
        {onDelete && (
          <button 
            onClick={handleDeleteClick}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>

      {/* Post content */}
      <p className="mt-2 text-gray-700">{post.content}</p>
      
      {/* Post image */}
      {post.image && (
        <div className="mt-4">
          <img 
            src={post.image} 
            alt="Post content" 
            className="rounded-lg max-h-96 w-full object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center space-x-4 border-t pt-4">
        <button 
          onClick={handleLikeClick}
          className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
        >
          <span>❤️</span>
          <span>{post.likes_count}</span>
        </button>
        
        <button 
          onClick={handleClick}
          className="text-gray-500 hover:text-blue-500"
        >
          💬 {post.comments?.length || 0}
        </button>
      </div>

      {/* Comments section */}
      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <h4 className="font-bold mb-4">Comments</h4>
          <div className="space-y-4">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-bold">{comment.author?.name}</p>
                <p className="text-sm mt-1">{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex space-x-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder="Add a comment..."
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={handleCommentSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function Community() {
  const location = useLocation();
  const { user } = location.state || { user: { name: "Guest", role: "guest" } };
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    try {
      setLoading(true);
      const fetchedPosts = postService.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (content, image) => {
    try {
      setIsLoading(true);
      
      if (!content.trim()) {
        toast.error("Post content cannot be empty");
        return;
      }

      // Create a basic user object if not present
      const currentUser = user || { 
        id: 'guest-' + Date.now(),
        name: 'Guest',
        role: 'guest'
      };

      let imageUrl = null;
      if (image) {
        imageUrl = await handleImageUpload(image);
      }

      const newPost = postService.addPost({
        content,
        image: imageUrl,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role
        }
      });

      setPosts(prevPosts => [newPost, ...prevPosts]);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (image) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(image);
    });
  };

  const handleLike = (postId) => {
    try {
      // Update posts state immediately for better UX
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes_count: (post.likes_count || 0) + 1 }
            : post
        )
      );

      // Call the service to persist the change
      const updatedPost = postService.likePost(postId, user.id);
      
      // Update again with the response from the service (optional)
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? updatedPost : post
        )
      );
    } catch (error) {
      // Revert the like if the server request fails
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes_count: (post.likes_count || 0) - 1 }
            : post
        )
      );
      toast.error("Failed to like post");
    }
  };

  const handleComment = (postId, commentText) => {
    try {
      const updatedPost = postService.addComment(postId, {
        text: commentText,
        author: {
          id: user.id,
          name: user.name
        }
      });
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? updatedPost : post
        )
      );
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleDeletePost = (postId) => {
    try {
      postService.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      toast.success("Post deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentUser={user} />
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {user?.name || 'Guest'} ({user?.role || 'guest'})
        </h1>
        <CreatePost onPost={handleCreatePost} />
        
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Posts Grid Layout */}
        {posts.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                currentUser={user}
                onLike={handleLike}
                onComment={handleComment}
                onDelete={post.author?.id === user.id || user.role === 'admin' ? handleDeletePost : null}
                onClick={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
                isExpanded={selectedPost?.id === post.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 p-8 bg-white rounded-lg shadow mt-8">
            <p className="text-xl">No posts yet</p>
            <p className="mt-2">Be the first to create a post!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Community;