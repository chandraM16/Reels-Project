import React from "react";
import { useGlobalContext } from "../Context/GlobalContext";
import { MainBox } from "./MainBox";

export const Home = ({ allPosts }) => {
  const { user } = useGlobalContext();
  return (
    <>
      <div id="shell" className="outer-shell">
        {allPosts.map((obj) => {
          return <MainBox postObj={obj} userId={user.id} key={obj.postID} />;
        })}
      </div>
    </>
  );
};
