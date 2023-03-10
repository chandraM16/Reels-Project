import React, {useEffect} from "react";
import "../Feed/feed.css";
import { PostContent } from "./PostContent";
import { Like } from "./Like";
import { Comment } from "./Comment";
import { CircularProgress } from "@mui/material";
import { useFirebase } from "../Context/FirebaseContext";


export const MainBox = (prop) => {
  const { postObj, userId } = prop;
  console.log(postObj)
  const { updateTheCompleteDoc } = useFirebase();

  
  return (
    <div className=" main-box">
      <div className="vid-cont">{<PostContent src={postObj.postUrl} />}</div>
      <div className="post-info-cont">
        <div className="user-name-cont">
          <img src={postObj.userProfile} alt="" className="profile-pic" />
          <h2>{postObj.userName}</h2>
          
        </div>
        <Like postObj={postObj} userId={userId} />
        <Comment postObj={postObj} />
      </div>
    </div>
  );
};
