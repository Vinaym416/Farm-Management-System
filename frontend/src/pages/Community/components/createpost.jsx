import React, { useState } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';

export function CreatePost({ onPost }) {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      const imageBase64 = previewImage || null;
      onPost(content, imageBase64);
      setContent('');
      setImageFile(null);
      setPreviewImage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your farming updates..."
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        rows={3}
      />

      {previewImage && (
        <div className="mt-2 relative">
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-auto rounded-lg"
          />
          <button
            type="button"
            onClick={() => {
              setImageFile(null);
              setPreviewImage(null);
            }}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-2">
        <label
          htmlFor="image-upload"
          className="text-gray-500 hover:text-green-600 p-2 rounded-lg transition cursor-pointer flex items-center space-x-2"
        >
          <ImageIcon className="h-5 w-5" />
          <span>Upload Image</span>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition"
        >
          <Send className="h-4 w-4" />
          <span>Post</span>
        </button>
      </div>
    </form>
  );
}