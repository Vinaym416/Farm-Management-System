import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./components/header";
import { CreatePost } from "./components/createpost";
import { Post } from "./components/post";

const initialPosts = [
  {
    id: "1",
    content:
      "Important update: New sustainable farming workshop next week! All farmers are welcome to join.",
    author: {
      id: "2",
      name: "Admin Sarah",
      role: "admin",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    },
    timestamp: "2 hours ago",
    likes: 15,
    comments: 5,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
  },
];

function Community() {
  const location = useLocation();
  const { user } = location.state || { user: { name: "Guest", role: "guest" } };
  const [posts, setPosts] = useState(initialPosts);

  const handleCreatePost = (content, image) => {
    const newPost = {
      id: String(Date.now()),
      content,
      author: user,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      image,
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentUser={user} />
      <main className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {user.name} ({user.role})
        </h1>
        <CreatePost onPost={handleCreatePost} />
        <div className="mt-8 space-y-6">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Community;