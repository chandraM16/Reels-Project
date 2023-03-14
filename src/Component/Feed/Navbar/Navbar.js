import * as React from "react";
import { Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import UploadButtons from "../Upload";
import "../../Feed/Navbar/navbar.css";
import { useNavigate, Link } from "react-router-dom";
function Navbar(prop) {
  const { handleLogOutClick, user } = prop;
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <div className="left-content">
        <div
          className="logo-cont"
          onClick={() => {
            navigate("/feed");
          }}
        >
          <img
            src="https://www.seekpng.com/png/detail/72-723182_aai-instagram-button-instagram-logo-word-png.png"
            alt="Aai Instagram Button - Instagram Logo Word Png@seekpng.com"
            className="logo"
          ></img>
        </div>
        <div className="upload-cont">
          <UploadButtons />
        </div>
      </div>
      <div className="right-content">
        <h4>Hi.. {user.userName}</h4>
        <div className="avatar-cont">
          <Link to="/userProfile">
            <Avatar
              alt="Travis Howard"
              src={user.profileUrl}
              sx={{ width: 56, height: 56 }}
            />
          </Link>
        </div>
        <div className="logout-cont" onClick={handleLogOutClick}>
          <LogoutIcon fontSize="large" />
        </div>
      </div>
    </div>
  );
}
export default Navbar;
