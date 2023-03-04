import React from "react";
import { ReactDOM } from "react";
export const PostContent = (prop) => {
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
    <video
      src={prop.src}
      className="video"
      muted="muted"
      onClick={(e) => {
        handleMutedClick(e);
      }}
      controls
      onEnded={(e) => {
        handleScroll(e);
      }}
    ></video>
  );
};
