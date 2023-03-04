import React, { useEffect, useState } from "react";
import { useFirebase } from "../Context/FirebaseContext";
import { useGlobalContext } from "../Context/GlobalContext";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { MainBox } from "./MainBox";
import Login from "../Login/Login";
import UploadButtons from "./Upload";
import "../Feed/feed.css";

export const Feed = () => {
  const { singOutFun, getAllPostData } = useFirebase();
  const { user, setUser } = useGlobalContext();
  console.log(user);
  const [postObjArr, setPostObjArr] = useState(null);
  const navigate = useNavigate();
  function handleLogOutClick() {
    setUser(null);
    singOutFun();
  }

  if (!user) {
    navigate("/");
  }

  useEffect(() => {
    (async () => {
      console.log("enter");
      const arrOfObj = await getAllPostData("posts");
      console.log(1);
      arrOfObj.sort((a, b) => b.createdAt - a.createdAt);
      console.log(2);
      console.log(arrOfObj);
      setPostObjArr(arrOfObj);
      console.log("done");
      return () => {
        setPostObjArr(null);
      };
    })();
  }, []);

  return (
    <div className="feed">
      {postObjArr == null ? (
        <CircularProgress />
      ) : (
        <div>
          <UploadButtons />
          <div className="outer-shell">
            {postObjArr.map((obj) => {
              return <MainBox postObj={obj} key={obj.postID} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
