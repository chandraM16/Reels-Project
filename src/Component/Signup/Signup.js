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

// import { makeStyles } from '@mui/styles';
import "../Signup/signup.css";
import { useGlobalContext } from "../Context/GlobalContext";
import { useFirebase } from "../Context/FirebaseContext";
import { async } from "@firebase/util";

export default function Signup() {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
    cPassword: "",
  });
  const [isOk, setIsOk] = useState("");
  const [error, setError] = useState("");

  const { signUpUserWithEmailAndPassword, createUserInDatabase } =
    useFirebase();
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
      createUserInDatabase({
        email: response.user.email,
        id: response.user.uid,
        password: userInput.password,
      });
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
              label="Email or Mobile No "
              variant="outlined"
              fullWidth={true}
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
