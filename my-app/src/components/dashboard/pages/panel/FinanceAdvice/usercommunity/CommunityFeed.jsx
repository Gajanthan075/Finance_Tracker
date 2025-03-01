import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";

const CommunityFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:5000/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Community Feed</h2>
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </div>
  );
};

export default CommunityFeed;
