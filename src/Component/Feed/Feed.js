import React from "react";
import { useFirebase } from "../Context/FirebaseContext";
import { useGlobalContext } from "../Context/GlobalContext";
import { Link } from "react-router-dom";
import Login from "../Login/Login";

export const Feed = () => {
  const { singOutFun } = useFirebase();
  const { user, setUser } = useGlobalContext();
  function handleLogOutClick() {
    setUser(null);
    singOutFun();
  }

  if (!user) {
    return <Login />;
  }
  return (
    <div className="feed">
      <h1>{user.email}</h1>
      <h1>{user.id}</h1>
      <button onClick={handleLogOutClick}>
        <Link to="/">Log Out</Link>
      </button>
    </div>
  );
};
