import React from "react";
import "../UserProfile/postbox.css";
export const PostBox = (prop) => {
  const { currUserPosts } = prop;
  return (
    <div className="postbox">
      {currUserPosts.map((postObj) => {
        return (
          <div className="post-cont" key={postObj?.postID}>
            <video src={postObj?.postUrl} className="post"></video>
          </div>
        );
      })}
    </div>
  );
};
