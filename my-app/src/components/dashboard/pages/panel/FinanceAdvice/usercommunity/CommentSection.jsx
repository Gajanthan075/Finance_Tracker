import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../../AuthContext";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const { userId } = useContext(AuthContext);

  // Fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(
        `http://localhost:5000/posts/${postId}/comments`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data); // Assuming backend returns a list of comments
      }
    };

    fetchComments();
  }, [postId]);

  // Add a new comment
  const handleAddComment = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${postId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: userId, // Replace with dynamic user ID from context
          content,
        }),
      }
    );

    if (response.ok) {
      const newComment = await response.json(); // Assuming backend returns the new comment
      setComments((prevComments) => [...prevComments, newComment]); // Append new comment
      setContent(""); // Clear input
    }
  };

  return (
    <div className="mt-2">
      <h4 className="text-sm font-semibold mb-1">Comments</h4>
      <ul className="mb-2">
        {comments.map((comment, index) => (
          <li key={index} className="text-white mb-1">
            <strong>User {comment.userid}: </strong> {comment.content}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleAddComment}
        className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700"
      >
        Comment
      </button>
    </div>
  );
};

export default CommentSection;
