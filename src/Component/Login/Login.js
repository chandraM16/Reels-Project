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
import { useGlobalContext } from "../Context/GlobalContext";
import { useFirebase } from "../Context/FirebaseContext";
import { Feed } from "../Feed/Feed";
import { Divider } from "@mui/material";
import { CircularProgress } from "@mui/material";

// import { makeStyles } from '@mui/styles';
import "../Login/login.css";
import { async } from "@firebase/util";

export default function Login() {
  //obj for user's input
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });

  // state for to check whether everything is good or not
  const [isOk, setIsOk] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // state or any error
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    loginWithEmailAndPassword,

    signUpWithGoogle,
    getDocument,
    getAllPostData,
  } = useFirebase();

  const { user, setUser } = useGlobalContext();

  // console.log(signUpUserWithEmailAndPassword);

  async function handleLoginClick() {
    try {
      //login
      setIsLoading(true);
      const response = await loginWithEmailAndPassword(
        userInput.email,
        userInput.password
      );
      setIsOk(true);
      setError("");

      //get the data of user from fireStore
      await getDataFromDataBase(response.user.uid);
      setIsLoading(false);

      //redirected to feed section
      navigate("/feed");
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

  async function handleLoginWithGoggle() {
    // login with google
    const response = await signUpWithGoogle();
    //get the data of user from fireStore
    await getDataFromDataBase(response.user.uid);

    //redirected to feed section
    navigate("/feed");
  }

  // get a data of user with given 'id' in 'users' collection of fireStore
  async function getDataFromDataBase(id) {
    const userDataObjFromDatabase = await getDocument(id);
    // set this user data in curr user State
    setUser(userDataObjFromDatabase);
    console.log("we got the data of the user from fireStore");
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
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
            <Divider orientation="horizontal" style={{ marginTop: "1rem" }} />
            <div className="goggle-btn-cont" style={{ margin: "1rem 0" }}>
              <Button
                variant="outlined"
                margin={"dense"}
                color="primary"
                fullWidth={true}
                onClick={handleLoginWithGoggle}
              >
                Login with Goggle
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
