import React, { useState } from 'react';
import { MessageCircle, Heart, Clock } from 'lucide-react';

export function Post({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments(comments + 1);
      setNewComment('');
      setShowCommentInput(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="h-10 w-10 rounded-full"
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{post.author.name}</span>
            <span
              className={`text-sm px-2 py-1 rounded-full ${
                post.author.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {post.author.role}
            </span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {post.timestamp}
          </div>
        </div>
      </div>
      <p className="text-gray-800 mb-4">{post.content}</p>

      {post.image && (
        <div className="mb-4">
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg mx-auto"
          />
        </div>
      )}

      <div className="flex items-center space-x-6 text-gray-500">
        <button
          className={`flex items-center space-x-2 transition ${
            isLiked ? 'text-red-500' : 'hover:text-red-500'
          }`}
          onClick={handleLike}
        >
          <Heart className="h-5 w-5" />
          <span>{likes}</span>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-blue-500 transition"
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          <MessageCircle className="h-5 w-5" />
          <span>{comments}</span>
        </button>
      </div>

      {showCommentInput && (
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}