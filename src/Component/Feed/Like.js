import React, { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useFirebase } from "../Context/FirebaseContext";
import { useGlobalContext } from "../Context/GlobalContext";
import { async } from "@firebase/util";
import { Done } from "@mui/icons-material";

export const Like = (prop) => {
  const { postObj, userId } = prop;
  const [isLike, setIsLike] = useState(false);
  const [likeClass, setLikeClass] = useState("normal");
  const { updateTheCompleteDoc } = useFirebase();

  async function handleLikeBtn() {
    if (!isLike) {
      setIsLike((prev) => !prev);
      setLikeClass("likeBtn");
      const newLikeArr = [...postObj.likes, userId];
      postObj.likes = [...postObj.likes, userId];
      await updateTheCompleteDoc("posts", postObj.postID, {
        likes: newLikeArr,
      });
      await updateTheCompleteDoc(
        `users/${postObj.userId}/posts`,
        postObj.postID,
        {
          likes: newLikeArr,
        }
      );
      console.log("like Done");
    } else {
      setIsLike((prev) => !prev);
      setLikeClass("normal");
      const [userId, ...restArr] = postObj.likes;
      postObj.likes = restArr;
      const newLikeArr = restArr;
      await updateTheCompleteDoc("posts", postObj.postID, {
        likes: newLikeArr,
      });
      await updateTheCompleteDoc(
        `users/${postObj.userId}/posts`,
        postObj.postID,
        {
          likes: newLikeArr,
        }
      );
      console.log("unlike Done");
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
