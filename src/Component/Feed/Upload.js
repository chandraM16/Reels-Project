import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import { app } from "../Context/FirebaseContext";
import { useGlobalContext } from "../Context/GlobalContext";
import { useFirebase } from "../Context/FirebaseContext";
import { uuidv4 } from "@firebase/util";
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  uploadFileInStorage,
} from "firebase/storage";
import { get } from "firebase/database";

const storage = getStorage(app);

export default function UploadButtons() {
  const { user, setUser } = useGlobalContext();
  const { makeSubCollection, getDocument, createUserInDatabase } =
    useFirebase();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //function for upload any file in storage
  async function uploadFileInStorage(file, path) {
    if (file == null) {
      return;
    }
    const fileRef = ref(storage, path);
    const response = await uploadBytes(fileRef, file);
    console.log("file upload", response);
    return response;
  }

  async function getUrlOfPost(path) {
    //create the ref of file form path of the file
    const refOfAllFiles = ref(storage, path);
    const response = await listAll(refOfAllFiles);
    return response.items.map(async (file) => {
      return await getDownloadURL(file);
    });
  }

  // when user upload the file
  async function handleFileUploadChange(file) {
    if (!file) {
      // Error handling
      setError("Please select a file first");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (file.size / (1024 * 1024) > 100) {
      // Error handling
      setError("This video is very big");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      try {
        // generate the uid for post
        const fileId = uuidv4();

        // upload in storage with actual file , file, name user id and file id
        // userId -> posts -> postId (file id) -> fileName
        setIsLoading(true);
        await uploadFileInStorage(
          file,
          `${user.id}/posts/${fileId}/${file.name}`
        );

        // upload in post folder
        await uploadFileInStorage(file, `posts/${fileId}/${file.name}`);

        // get url of post from storage
        let response = await getUrlOfPost(`${user.id}/posts/${fileId}`);
        let url = await response[0];
        console.log(url);

        // dataBase update
        const postInfoObj = {
          likes: [],
          comments: [],
          postID: fileId,
          postUrl: url,
          PostName: file.name,
          userId: user.id,
          userName: user.userName,
          createdAt: Date.now(),
        };
        makeSubCollection(`users/${user.id}/posts`, fileId, postInfoObj);
        createUserInDatabase("posts", fileId, postInfoObj);
      } catch (error) {
        console.log(error);
      } finally {
        const updatedUserData = await getDocument(user.id);
        setUser(updatedUserData);
        setIsLoading(false);
      }
    }
  }

  return (
    <div style={{ width: "10rem" }}>
      {error != "" ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              color="secondary"
              variant="outlined"
              component="label"
              disabled={isLoading}
            >
              Upload Video
              <input
                hidden
                accept="video/*"
                multiple
                type="file"
                onChange={(e) => {
                  console.log("hi");
                  handleFileUploadChange(e.target.files[0]);
                }}
              />
            </Button>
          </Stack>
          {isLoading && <LinearProgress color="secondary" />}
        </>
      )}
    </div>
  );
}
