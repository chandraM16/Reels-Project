import React, { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useFirebase } from "../Context/FirebaseContext";
import { useGlobalContext } from "../Context/GlobalContext";

export const Like = (prop) => {
  const { postObj, userId } = prop;
  const [isLike, setIsLike] = useState(false);

  const [likeClass, setLikeClass] = useState("normal");
 

  function handleLikeBtn() {
    if (!isLike) {
      setIsLike((prev) => !prev);
      setLikeClass("likeBtn");
      postObj.likes = [...postObj.likes, userId];
      
    } else {
      setIsLike((prev) => !prev);
      setLikeClass("normal");
      const [userId, ...restArr] = postObj.likes;
      postObj.likes = restArr;
    }
  }

  useEffect(() => {
    if (postObj.likes.includes(userId)) {
      setIsLike(true);
      setLikeClass("likeBtn");
    }
  }, []);
  return (
    <div className="post-likes-cont">
      <FavoriteIcon
        fontSize="large"
        className={likeClass}
        onClick={handleLikeBtn}
      />
      <h4 className="post-like">{postObj.likes.length} </h4>
    </div>
  );
};
