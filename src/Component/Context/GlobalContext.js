import React, { createContext, useContext, useState } from "react";

export const ContextState = createContext();
export const useGlobalContext = () => {
  return useContext(ContextState);
};
export const GlobalContext = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
  };

  console.log(user);

  return (
    <ContextState.Provider value={value}>
      {props.children}
    </ContextState.Provider>
  );
};
