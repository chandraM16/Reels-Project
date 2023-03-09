import logo from "./logo.svg";
import "./App.css";
import SignUp from "./Component/Signup/Signup";
import Login from "./Component/Login/Login";
import { UserBox } from "./Component/Feed/UserProfile/UserBox";
import { Feed } from "./Component/Feed/Feed";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Component/ProtectedRoute";
import { UserProfile } from "./Component/Feed/UserProfile/UserProfile";
import MyModal from "./Component/Feed/Modal/MyModal";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      {/* <Route path="/user" element={<UserBox />} /> */}
      <Route path="/userProfile" element={<UserProfile />} />
      {/* <Route path="/modal" element={<MyModal />} /> */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
