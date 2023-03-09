import React from "react";
import "../../Feed/UserProfile/userbox.css";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MyModal from "../Modal/MyModal";
export const UserBox = (prop) => {
  const { user } = prop;
  return (
    <div className="user-box-cont">
      <div className="user-profile-cont">
        <img src={user.profileUrl} alt="" className="user-profile" />
      </div>
      <div className="user-detail-cont">
        <h3 className="user-name">{user.userName}</h3>
        {!user.about ? (
          <p className="user-about">About Yourself.... </p>
        ) : (
          <p className="user-about">{user.about}</p>
        )}
        <div className="user-emailAndTime-cont">
          <div className="user-emailAndTime">
            <p>{user.email}</p>
            <p>{new Date(+user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="user-setting">
            <MyModal />
          </div>
        </div>
      </div>
    </div>
  );
};
