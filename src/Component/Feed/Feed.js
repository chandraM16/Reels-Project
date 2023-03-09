import React, { useEffect, useState } from "react";
import { useFirebase } from "../Context/FirebaseContext";
import { useGlobalContext } from "../Context/GlobalContext";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { MainBox } from "./MainBox";
import Navbar from "./Navbar/Navbar";
import Login from "../Login/Login";
import UploadButtons from "./Upload";
import "../Feed/feed.css";

export const Feed = () => {
  const { singOutFun, getAllPostData, makeDocAtPath, updateTheCompleteDoc } =
    useFirebase();
  const {
    user,
    setUser,
    setAllPosts,
    allPosts,
    setCurrUserPosts,
    currUserPosts,
  } = useGlobalContext();

  const navigate = useNavigate();

  //function for logout
  async function handleLogOutClick() {
    // put all post obj in proper place in fire Store

    await allPosts.forEach((obj) => {
      console.log(obj);
      // place obj in "posts" collection
      updateTheCompleteDoc("posts", obj.postID, obj);

      // place obj in "users" collection
      updateTheCompleteDoc(`users/${obj.userId}/posts`, obj.postID, obj);

      // place updated user obj in fireStor
      updateTheCompleteDoc("users/", user.id, user);
    });
    setAllPosts(null);
    setCurrUserPosts(null);
    setUser(null);
    singOutFun();
  }

  //if user is null then we cant enter in feed section
  // this is a part of protected Route
  if (!user) {
    navigate("/");
  }

  // whenever user login, we fetch the data form 'post' collection of fireStore and store in current state 'allPosts' and at the end sort those allPosts array on basis of created property of each object, so that latest post come first.
  useEffect(() => {
    console.log(allPosts);
    console.log(currUserPosts);
  }, [allPosts, currUserPosts]);

  return (
    <div className="feed">
      <div className="container">
        <Navbar handleLogOutClick={handleLogOutClick} user={user} />
        {allPosts == null ? (
          <CircularProgress />
        ) : (
          <div className="outer-shell">
            {allPosts.map((obj) => {
              return (
                <MainBox postObj={obj} userId={user.id} key={obj.postID} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
