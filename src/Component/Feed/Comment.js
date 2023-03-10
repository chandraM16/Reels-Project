import { async } from "@firebase/util";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../Context/GlobalContext";
import { useFirebase } from "../Context/FirebaseContext";
export const Comment = (prop) => {
  const { postObj } = prop;
  const { user } = useGlobalContext();
  const { updateTheCompleteDoc } = useFirebase();
  const [localComment, setLocalComment] = useState("");
  // console.log(postObj);
  async function handleSetLocalCommentInPostObj() {
    console.log(11);
    const newCommentsArr = [
      {
        name: user.userName,
        commentText: localComment,
      },
      ...postObj.comments,
    ];
    
    postObj.comments = [
      {
        name: user.userName,
        commentText: localComment,
      },
      ...postObj.comments,
    ];

     updateTheCompleteDoc("posts", postObj.postID, {
      comments: newCommentsArr,
    });
     updateTheCompleteDoc(
      `users/${postObj.userId}/posts`,
      postObj.postID,
      {
        comments: newCommentsArr,
      }
    );
    setLocalComment("");
  }

  return (
    <div className="post-comments-cont">
      <h4>Comments :-</h4>
      <div className="comment-input-cont">
        <input
          type="text"
          className="comment-input"
          placeholder="Say Something"
          value={localComment}
          onChange={(e) => {
            setLocalComment(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleSetLocalCommentInPostObj();
            }
          }}
        />
      </div>
      <div className="post-comment">
        {postObj.comments.map((commentObj, i) => {
          return (
            <div className="comment-box" key={i}>
              <h3 className="comment-user-name" style={{ margin: "0" }}>
                {commentObj.name} :-
              </h3>
              <div className="comment">{commentObj.commentText}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
