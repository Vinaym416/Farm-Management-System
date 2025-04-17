import React, { useState } from 'react';

export const CreatePost = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onPost(content, image);
    setContent('');
    setImage(null);
    setPreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-4 border rounded-lg mb-4 min-h-[100px]"
        required
      />
      
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
        >
          Add Image
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Post
        </button>
      </div>

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 rounded-lg"
          />
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setPreview('');
            }}
            className="mt-2 text-red-500 hover:text-red-700"
          >
            Remove Image
          </button>
        </div>
      )}
    </form>
  );
};