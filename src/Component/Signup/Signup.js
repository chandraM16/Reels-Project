import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";

// import { makeStyles } from '@mui/styles';
import "../Signup/signup.css";
import { useGlobalContext } from "../Context/GlobalContext";
import { useFirebase } from "../Context/FirebaseContext";
import { async } from "@firebase/util";

export default function Signup() {
  const [userInput, setUserInput] = useState({
    userName: "",
    email: "",
    password: "",
    cPassword: "",
  });
  const [isOk, setIsOk] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    signUpUserWithEmailAndPassword,
    createUserInDatabase,
    signUpWithGoogle,
  } = useFirebase();
  // console.log(signUpUserWithEmailAndPassword);

  async function handleSignUpClick() {
    if (userInput.password != userInput.cPassword) {
      setError("Passwords are Not Match");
      setTimeout(() => {
        setError("");
      }, 2000);
      setIsOk("");
      return;
    }

    try {
      const response = await signUpUserWithEmailAndPassword(
        userInput.email,
        userInput.password
      );
      console.log(response);
      const userObj = response.user;
      console.log(userObj);

      setIsOk("Successfully Sign Up");
      setError("");
      putDataInDataBase(
        userInput.userName,
        userObj.email,
        userObj.uid,
        userInput.password,
        userObj.metadata.createdAt
      );
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.log(error);
      setIsOk("");
      setError("Email Already In Use");
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
    }
  }

  async function handleSignUpWithGoggle() {
    const response = await signUpWithGoogle();
    console.log(response);
    setIsOk("Successfully Sign Up");
    setError("");
    putDataInDataBase(
      response.user.displayName,
      response.user.email,
      response.user.uid,
      "googleSignIn",
      response.user.metadata.createdAt
    );

    setTimeout(() => {
      navigate("/");
    }, 3000);
  }

  function putDataInDataBase(userName, email, id, password, createdAt) {
    createUserInDatabase("users", id, {
      userName,
      email,
      password,
      id,
      createdAt,
      profileUrl:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    });
  }

  return (
    <div className="signUpWrapper">
      <div className="signUpCard">
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
            <Typography className="subtitle" variant="subtitle1">
              Sign up to see photos and videos from your friends
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
              fullWidth={true}
              margin={"dense"}
              type="text"
              value={userInput?.userName}
              onChange={(e) => {
                setUserInput({ ...userInput, userName: e.target.value });
              }}
            />
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              fullWidth={true}
              type="email"
              margin={"dense"}
              value={userInput?.email}
              onChange={(e) => {
                setUserInput({ ...userInput, email: e.target.value });
              }}
            />
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth={true}
              margin={"dense"}
              value={userInput?.password}
              onChange={(e) => {
                setUserInput({ ...userInput, password: e.target.value });
              }}
            />
            <TextField
              id="outlined-basic"
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth={true}
              margin={"dense"}
              value={userInput?.cPassword}
              onChange={(e) => {
                setUserInput({ ...userInput, cPassword: e.target.value });
              }}
            />
            <div className="login-btn-cont">
              <Button
                variant="contained"
                margin={"dense"}
                onClick={handleSignUpClick}
              >
                Sign Up
              </Button>
            </div>
            <Divider orientation="horizontal" style={{ marginTop: "1rem" }} />
            <div className="goggle-btn-cont" style={{ margin: "1rem 0" }}>
              <Button
                variant="outlined"
                margin={"dense"}
                color="primary"
                fullWidth={true}
                onClick={handleSignUpWithGoggle}
              >
                Sign Up with Goggle
              </Button>
            </div>
            {isOk && <Alert severity="success">{isOk}</Alert>}
            <Typography
              className="subtitle"
              variant="subtitle1"
              margin={"0.5rem"}
            >
              By signing up , you agree to our term, condition, data policy and
              cookies policy.
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <Typography className="subtitle" variant="subtitle1" margin={"1rem"}>
            Already have an account?{" "}
            <Link to="/" style={{ textDecoration: "none" }}>
              Login
            </Link>
          </Typography>
        </Card>
      </div>
    </div>
  );
}
