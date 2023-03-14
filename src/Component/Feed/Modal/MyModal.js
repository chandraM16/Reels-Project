import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TextField from "@mui/material/TextField";
import Submit from "./Submit";
import { useGlobalContext } from "../../Context/GlobalContext";
import Alert from "@mui/material/Alert";
import { uuidv4 } from "@firebase/util";
import { uploadFileInStorage, getUrlOfPost } from "../Upload";
import { useFirebase } from "../../Context/FirebaseContext";
import { getDataFromDataBase } from "../../Login/Login";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function ChildModal() {
  const { updateTheCompleteDoc, getDocument } = useFirebase();
  const { user, setUser } = useGlobalContext();
  const [userInput, setUserInput] = useState({
    oldPawd: "",
    newPawd: "",
    confPawd: "",
  });

  const [error, setError] = useState("");
  const [isOk, setIsOk] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  async function handlePasswordSubmit() {
    if (userInput.newPawd != userInput.confPawd) {
      setError("New Password and Confirm Password are not matched.");
      setIsOk(false);
      return;
    } else if (userInput.oldPawd != user.password) {
      setError("Invalid Old Password");
      setIsOk(false);
      return;
    } else {
      await updateTheCompleteDoc("users/", user.id, {
        password: userInput.newPawd,
      });
      const updatedUser = await getDocument(user.id);
      setUser(updatedUser);
      setError("");
      setIsOk(true);
      setTimeout(handleClose, 2000);
    }
  }

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Change Password</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 350, borderRadius: "0.6rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Change Password:</h2>
          {error != "" && <Alert severity="error">{error}</Alert>}
          {isOk && <Alert severity="success">Password Updated!</Alert>}
          <TextField
            id="outlined-basic"
            label="Current Password"
            variant="outlined"
            margin={"dense"}
            type="password"
            value={userInput.oldPawd}
            onChange={(e) => {
              setUserInput({ ...userInput, oldPawd: e.target.value });
            }}
          />
          <TextField
            id="outlined-basic"
            label="New Password"
            variant="outlined"
            margin={"dense"}
            type="password"
            value={userInput.newPawd}
            onChange={(e) => {
              setUserInput({ ...userInput, newPawd: e.target.value });
            }}
          />
          <TextField
            id="outlined-basic"
            label="Confirm Password"
            variant="outlined"
            margin={"dense"}
            type="password"
            value={userInput.confPawd}
            onChange={(e) => {
              setUserInput({ ...userInput, confPawd: e.target.value });
            }}
          />

          <Button
            onClick={handlePasswordSubmit}
            variant="outlined"
            style={{
              position: "absolute",
              right: "34px",
              bottom: "30px",
              fontSize: "1rem",
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function MyModal() {
  const { updateTheCompleteDoc, getDocument } = useFirebase();
  const { user, setUser } = useGlobalContext();
  const [userInput, setUserInput] = useState({
    userName: user.userName,
    about: user.about,
    city: user.city,
    contactNo: user.contactNo,
  });
  const [error, setError] = useState("");
  const [isOk, setIsOk] = useState(false);
  const [fileObj, setFileObj] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  async function handleInfoUpdateSubmit() {
    if (userInput.contactNo.length != 10) {
      setIsOk(false);
      setError("Contact No. Is Invalid");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    try {
      if (fileObj) {
        console.log(123);
        // generate the uid for post
        const fileId = uuidv4();

        // process of uploading in Storage is start
        setIsLoading(true);

        // upload in post folder in Storage
        await uploadFileInStorage(
          fileObj,
          `allPhoto/${fileId}/${fileObj.name}`
        );

        // get url of post from storage
        let response = await getUrlOfPost(`allPhoto/${fileId}`);
        let url = await response[0];
        setUser({ ...user, profileUrl: url });
        updateTheCompleteDoc("users/", user.id, { profileUrl: url });
        setIsLoading(false);
      }

      await updateTheCompleteDoc("users/", user.id, userInput);
      const updatedUser = await getDocument(user.id);
      setUser(updatedUser);

      setIsOk(true);
      setError("");

      setTimeout(() => {
        handleClose();
        setIsOk(false);
      }, 1000);
    } catch (err) {
      console.log(err);
      setError("Something Went Wrong");
      setIsOk(false);
    }
  }

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      <Button onClick={handleOpen}>
        <ManageAccountsIcon fontSize="large" style={{ color: "black" }} />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "40rem", borderRadius: "0.4rem" }}>
          <div className="updated-box">
            <h2 style={{ marginBottom: "1rem" }}>Chandan</h2>
            {error != "" && <Alert severity="error">{error}</Alert>}
            {isOk && <Alert severity="success">Profile Updated!</Alert>}
            <TextField
              id="outlined-basic"
              label="User Name"
              variant="outlined"
              margin={"dense"}
              value={userInput.userName}
              onChange={(e) => {
                setUserInput({ ...userInput, userName: e.target.value });
              }}
            />

            <TextField
              id="outlined-basic"
              label="About"
              variant="outlined"
              margin={"dense"}
              value={userInput.about}
              onChange={(e) => {
                setUserInput({ ...userInput, about: e.target.value });
              }}
            />

            <TextField
              id="outlined-basic"
              label="Contact No."
              variant="outlined"
              margin={"dense"}
              type="number"
              value={userInput.contactNo}
              onChange={(e) => {
                setUserInput({ ...userInput, contactNo: e.target.value });
              }}
            />
            <TextField
              id="outlined-basic"
              label="City"
              variant="outlined"
              margin={"dense"}
              value={userInput.city}
              onChange={(e) => {
                setUserInput({ ...userInput, city: e.target.value });
              }}
            />

            <h5>Profile Photo:-</h5>
            {fileObj && <p>{fileObj.name}</p>}
            <Button variant="outlined" component="label">
              Upload
              <input
                hidden
                accept="image/*"
                multiple
                disabled={isLoading}
                type="file"
                onChange={(e) => {
                  setFileObj(e.target.files[0]);
                }}
              />
            </Button>

            <div className="update-action-box">
              <div className="changePasswordModal">
                <ChildModal />
              </div>
              <Button
                disabled={isLoading}
                onClick={handleInfoUpdateSubmit}
                variant="outlined"
              >
                Submit
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
