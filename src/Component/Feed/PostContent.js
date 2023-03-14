import React from "react";
import { useGlobalContext } from "../Context/GlobalContext";
import { CircularProgress } from "@mui/material";

export const PostContent = (prop) => {
  const { allPosts } = useGlobalContext();
  function handleMutedClick(e) {
    e.preventDefault();
    e.target.muted = !e.target.muted;
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
