import React from "react";
import { useAuth } from "../../../../../../AuthContext";

const LikePost = ({ postId }) => {
  const { apiFetch, userId } = useAuth();

  const handleLike = async () => {
    try {
      await apiFetch(
        `http://localhost:5000/api/community/posts/${postId}/like`,
        {
          method: "POST",
          body: JSON.stringify({ userid: userId }),
        }
      );
      alert("Post liked!");
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  return <button onClick={handleLike}>Like</button>;
};

export default LikePost;
