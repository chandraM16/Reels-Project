import React from "react";
import { ReactDOM } from "react";
import { useGlobalContext } from "../Context/GlobalContext";
import { CircularProgress } from "@mui/material";

export const PostContent = (prop) => {
  const { allPosts } = useGlobalContext();
  function handleMutedClick(e) {
    e.preventDefault();
    e.target.muted = !e.target.muted;
  }

  function handleScroll(e) {
    let nextNode = ReactDOM.findDOMNode(e.target).parentNode.parentNode
      .nextSibling;
    if (nextNode) {
      nextNode.scrollIntoView();
      e.target.muted = true;
    }
  }
  return (
    <>
      {allPosts == null ? (
        <CircularProgress />
      ) : (
        <div>
          <video
            controls
            // muted="false"
            src={prop.src}
            className="video"
            onDoubleClick={(e) => {
              e.preventDefault();
              // handleMutedClick(e);
            }}
          ></video>
        </div>
      )}
    </>
  );
};
