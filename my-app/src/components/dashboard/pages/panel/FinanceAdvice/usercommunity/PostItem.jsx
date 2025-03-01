import React, { useState } from "react";
import CommentSection from "./CommentSection";

const PostItem = ({ post }) => {
  const [likes, setLikes] = useState(post?.likes?.length || 0);

  const handleLike = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${post?._id}/like`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: "12345" }),
      }
    );

    if (response.ok) {
      setLikes((prev) => prev + 1);
    }
  };

  // Utility to safely get the first letter of userid
  const getFirstLetter = (userid) => {
    if (!userid) return "?"; // Fallback when userid is undefined
    return userid.charAt(0).toUpperCase();
  };

  return (
    <div className="p-4 mb-4 bg-black text-white rounded shadow">
      {/* Header Section */}
      <div className="flex items-center mb-2">
        {/* Placeholder for user avatar using userid */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold mr-3">
          {getFirstLetter(post?.author?.userid)}{" "}
          {/* Display first letter of userid */}
        </div>
        <div>
          <h3 className="font-bold">
            {post?.author?.name || "Unknown User"}{" "}
            <span className="text-gray-400">
              @{post?.author?.username || "unknown"}
            </span>
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <p className="mb-2 text-gray-300">
        {post?.content || "No content available"}
      </p>

      {/* Mention Styling */}
      {post?.content?.includes("@") && (
        <span className="text-blue-500">{post?.mentions}</span>
      )}

      {/* Footer Section */}
      <div className="flex items-center justify-between mt-2 text-white">
        <button
          onClick={handleLike}
          className="hover:text-blue-500 hover:underline"
        >
          Like ({likes})
        </button>
        <span>{post?.comments?.length || 0} comments</span>
        <span className="text-sm">{post?.timestamp || "N/A"}</span>
      </div>

      {/* Comment Section */}
      {post?._id && <CommentSection postId={post._id} />}
    </div>
  );
};

export default PostItem;
