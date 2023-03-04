import logo from "./logo.svg";
import "./App.css";
import SignUp from "./Component/Signup/Signup";
import Login from "./Component/Login/Login";

import { MainBox } from "./Component/Feed/MainBox";
import { Feed } from "./Component/Feed/Feed";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Component/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
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
