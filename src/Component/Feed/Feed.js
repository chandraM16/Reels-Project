import React, { useEffect, useState } from "react";
import { useFirebase } from "../Context/FirebaseContext";
import { useGlobalContext } from "../Context/GlobalContext";
import { Link, useNavigate, Route, Routes } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { MainBox } from "./MainBox";
import Navbar from "./Navbar/Navbar";
import { Home } from "./Home";
import Login from "../Login/Login";
import UploadButtons from "./Upload";
import { UserProfile } from "../../Component/Feed/UserProfile/UserProfile";
import "../Feed/feed.css";
// import { Home } from "./Home";

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
    updateTheCompleteDoc("users/", user.id, user);
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
    console.log(user);
    // console.log(currUserPosts);
  }, [user]);

  useEffect(() => {
    (async function () {
      // whenever user login, we fetch the data form 'post' collection of fireStore and store in current state 'allPosts' and at the end sort those allPosts array on basis of created property of each object, so that latest post come first.

      const arrOfPostObj = await getAllPostData("posts");
      setAllPosts(arrOfPostObj.sort((a, b) => b.createdAt - a.createdAt));
      console.log("allPost data is fetched");

      const allPostOFCurrUser = await getAllPostData(`users/${user.id}/posts/`);
      setCurrUserPosts(
        allPostOFCurrUser.sort((a, b) => b.createdAt - a.createdAt)
      );
      console.log("allPost data of user  is fetched");
    })();
  }, []);

  return (
    <div className="feed">
      <div className="container">
        <Navbar handleLogOutClick={handleLogOutClick} user={user} />
      </div>
      {allPosts == null ? (
        <CircularProgress />
      ) : (
        <div className="container">
          <Home allPosts={allPosts} />
        </div>
      )}
    </div>
  );
};
