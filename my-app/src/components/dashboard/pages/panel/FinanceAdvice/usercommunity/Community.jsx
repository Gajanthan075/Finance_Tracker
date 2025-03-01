import React from "react";
import CommunityFeed from "./CommunityFeed";
import CreatePost from "./CreatePost";

const Community = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-blue-600 text-white text-center">
        <h1 className="text-2xl font-bold">User Community</h1>
      </header>
      <CreatePost />
      <CommunityFeed />
    </div>
  );
};

export default Community;
