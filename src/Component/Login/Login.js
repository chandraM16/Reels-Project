import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../Context/GlobalContext";
import { useFirebase } from "../Context/FirebaseContext";
import { Feed } from "../Feed/Feed";

// import { makeStyles } from '@mui/styles';
import "../Login/login.css";

export default function Login() {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const [isOk, setIsOk] = useState(false);
  const [error, setError] = useState("");

  const { loginWithEmailAndPassword, getDataUsingEmail } = useFirebase();
  const { setUser, user } = useGlobalContext();

  // console.log(signUpUserWithEmailAndPassword);

  async function handleLoginClick() {
    try {
      const response = await loginWithEmailAndPassword(
        userInput.email,
        userInput.password
      );
      console.log(response);
      setIsOk(true);
      setError("");
      const userDataObjFromDatabase = await getDataUsingEmail(userInput.email);
      setUser(userDataObjFromDatabase[0]);
    } catch (error) {
      console.log(error);
      setIsOk(false);
      setError("Email or Password is Incorrect");
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
    }
  }

  if (isOk) {
    return <Feed />;
  }
  return (
    <div className="loginWrapper">
      <div className="loginCard">
        {/* variant="outlined" is provided by material ui */}
        <Card variant="outlined">
          <div className="logo-cont">
            <img
              src={
                "https://www.vectorlogo.zone/logos/instagram/instagram-ar21.png"
              }
              alt=""
              className="logo-img"
            />
          </div>
          <CardContent>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              id="outlined-basic"
              label="Email or Mobile No "
              type="email"
              variant="outlined"
              fullWidth={true}
              margin={"dense"}
              value={userInput.email}
              onChange={(e) => {
                setUserInput({ ...userInput, email: e.target.value });
              }}
            />
            <TextField
              id="outlined-basic"
              type="password"
              label="Password"
              variant="outlined"
              fullWidth={true}
              margin={"dense"}
              value={userInput.password}
              onChange={(e) => {
                setUserInput({ ...userInput, password: e.target.value });
              }}
            />
            <Typography color="primary" variant="subtitle1">
              Forgot Password?
            </Typography>
            <div className="login-btn-cont">
              <Button
                variant="contained"
                margin={"dense"}
                onClick={handleLoginClick}
              >
                Log In
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <Typography className="subtitle" variant="subtitle1" margin={"1rem"}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ textDecoration: "none" }}>
              Signup
            </Link>
          </Typography>
        </Card>
      </div>
    </div>
  );
}
