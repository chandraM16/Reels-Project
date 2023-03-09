import React, { createContext, useContext, useState } from "react";

export const ContextState = createContext();
export const useGlobalContext = () => {
  return useContext(ContextState);
};
export const GlobalContext = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [allPosts, setAllPosts] = useState(null);
  const [currUserPosts, setCurrUserPosts] = useState(null);

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    setAllPosts,
    allPosts,
    currUserPosts,
    setCurrUserPosts,
  };

  // console.log(user);

  return (
    <ContextState.Provider value={value}>
      {props.children}
    </ContextState.Provider>
  );
};
