import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage }) {
  const imageUrl = appwriteService.getFilePreview(featuredImage);
  console.log("🖼️ Rendering Image URL:", imageUrl); // ✅ Add this debug

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-black rounded-xl p-4">
        <div className="w-full flex justify-center mb-4">
          {featuredImage ? (
            <img
              src={imageUrl}
              alt={title}
              className="rounded-xl max-h-60 object-cover"
              onError={(e) => {
                console.error("❌ Failed to load image:", imageUrl);
                e.target.src = "/placeholder.png"; // Fallback image
              }}
            />
          ) : (
            <div className="text-white text-center">No image available</div>
          )}
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
