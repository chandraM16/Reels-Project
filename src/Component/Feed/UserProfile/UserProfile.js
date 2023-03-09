import React from "react";
import "../../Feed/UserProfile/userprofile.css";
import { useGlobalContext } from "../../Context/GlobalContext";
import { UserBox } from "./UserBox";
import { PostBox } from "./PostBox";
export const UserProfile = () => {
  const { user, currUserPosts } = useGlobalContext();
  return (
    <div className="user-box">
      <div className="container">
        <UserBox user={user} />
        <PostBox currUserPosts={currUserPosts} />
      </div>
    </div>
  );
};
