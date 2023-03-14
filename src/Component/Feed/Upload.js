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
} from "firebase/storage";
import { get } from "firebase/database";

const storage = getStorage(app);
//function for upload any file in storage
async function uploadFileInStorage(file, path) {
  if (file == null) {
    return;
  }
  const fileRef = ref(storage, path);
  const response = await uploadBytes(fileRef, file);
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

export default function UploadButtons() {
  const {
    user,
    setUser,
    setAllPosts,
    allPosts,
    currUserPosts,
    setCurrUserPosts,
  } = useGlobalContext();

  const { createObjInDatabase, getAllPostData } = useFirebase();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // when user upload the file
  async function handleFileUploadChange(file) {
    //if file is not present
    if (!file) {
      // Error handling
      setError("Please select a file first");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
    // if size of file is more than 100 mb then throw error
    else if (file.size / (1024 * 1024) > 100) {
      // Error handling
      setError("This video is very big");
      setTimeout(() => {
        setError("");
      }, 2000);
    }

    // every thing is ok
    else {
      try {
        // generate the uid for post
        const fileId = uuidv4();

        // process of uploading in Storage in start
        setIsLoading(true);

        // upload in post folder in Storage
        await uploadFileInStorage(file, `posts/${fileId}/${file?.name}`);

        // get url of post from storage
        let response = await getUrlOfPost(`posts/${fileId}`);
        let url = await response[0];
        console.log(
          "Post is Saved in Storage and Url of Post is generated",
          url
        );

        // create the obj about post
        const postInfoObj = {
          likes: [],
          comments: [],
          postID: fileId,
          postUrl: url,
          PostName: file.name,
          userId: user.id,
          userName: user.userName,
          userProfile : user.profileUrl,
          createdAt: Date.now(),
        };

        // updated AllPost array with new Post

        createObjInDatabase("posts", fileId, postInfoObj);
        createObjInDatabase(`users/${user.id}/posts`, fileId, postInfoObj);
        console.log("done");
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        const arrOfAllPostObj = await getAllPostData("posts");
        arrOfAllPostObj.sort((a, b) => b.createdAt - a.createdAt);
        setAllPosts(arrOfAllPostObj);
        console.log("post is saved in curr allPost Array");

        const arrOfCurrPostObj = await getAllPostData(`users/${user.id}/posts`);
        arrOfCurrPostObj.sort((a, b) => b.createdAt - a.createdAt);
        setCurrUserPosts(arrOfCurrPostObj);
        console.log();
        console.log("post is saved in CurrUserObj");
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
              style ={{fontSize : "1rem"}}
            >
              Upload Video
              <input
                hidden
                accept="video/*"
                multiple
                type="file"
                onChange={(e) => {
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

export { getUrlOfPost, uploadFileInStorage };
