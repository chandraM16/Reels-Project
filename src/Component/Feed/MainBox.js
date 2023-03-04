import React from "react";
import "../Feed/feed.css";
import { PostContent } from "./PostContent";

export const MainBox = (prop) => {
  const { postObj } = prop;
  return (
    <div className=" main-box">
      <div className="vid-cont">
        <PostContent src={postObj.postUrl} />{" "}
      </div>
      <div className="post-info-cont">
        <div className="user-name-cont">
          <img src={postObj.profileUrl} alt="" className="profile-pic" />
          <h2>{postObj.userName}</h2>
        </div>
        <div className="post-likes-cont">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "35px" }}
          >
            favorite
          </span>
          <h4 className="post-like">{postObj.likes.length} </h4>
        </div>
        <div className="post-comments-cont">
          <h4>Comments :-</h4>
          <div className="post-comment">
            {postObj.comments.map((comment) => {
              return <p>{comment}</p>;
            })}
          </div>
          <div className="comment-input-cont">
            <input
              type="text"
              className="comment-input"
              placeholder="Say Something"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
