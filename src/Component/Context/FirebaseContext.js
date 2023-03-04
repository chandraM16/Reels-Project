import { createContext, useContext } from "react";
import React from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// For Auth
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

// for FireStore
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import { async } from "@firebase/util";

const firebaseConfig = {
  apiKey: "AIzaSyC7oPDHUTDCgxtSHdsJBgM9YhuCE_uYD1w",
  authDomain: "reels-9ae9e.firebaseapp.com",
  projectId: "reels-9ae9e",
  storageBucket: "reels-9ae9e.appspot.com",
  messagingSenderId: "277955749524",
  appId: "1:277955749524:web:41c2efa163976eef3df681",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const firebaseAuth = getAuth(app);
const firebaseDatabase = getDatabase(app);
const googleProviderAuth = new GoogleAuthProvider();
const fireStore = getFirestore(app);

const FirebaseContextObj = createContext(null);

export const useFirebase = () => {
  return useContext(FirebaseContextObj);
};

export const FirebaseContext = (props) => {
  // Function for sign up user with email and password
  const signUpUserWithEmailAndPassword = (email, password) => {
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  };

  //login
  const loginWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  // put data in dataBase
  const putData = (key, data) => {
    return set(ref(firebaseDatabase, key), data);
  };

  // sign with google
  const signUpWithGoogle = () => {
    return signInWithPopup(firebaseAuth, googleProviderAuth);
  };

  //to check weather user is log in ot not
  const afterUserLogin = (setUser) => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // you are going
        console.log(user);
        setUser(user);
      } else {
        console.log("you are logged out");
        setUser(null);
      }
    });
  };

  //sign out
  const singOutFun = () => {
    signOut(firebaseAuth);
  };

  //Create Collection
  const createUserInDatabase = async (path, id, userObj) => {
    // setDoc(doc(db, "users", id), userObj);
    const response = await setDoc(doc(fireStore, path, id), userObj);
    console.log("Firebase", response);
    return response;
  };

  // make document in user post collection
  const makeSubCollection = async (path, id, inputObj) => {
    try {
      // setDoc(doc(fireStore, path, id), userObj);
      const response = await setDoc(doc(fireStore, path, id), inputObj);
      console.log("sub Collection", response);
    } catch (error) {
      console.log(error);
    }
  };

  // read database with given Doc id
  const getDocument = async (id) => {
    const ref = doc(fireStore, "users", id);
    const response = await getDoc(ref);
    console.log(response.data());
    return response.data();
  };

  // read database with Doc id
  const getDataUsingEmail = async (email) => {
    const collectionRef = collection(fireStore, "users");
    const q = query(collectionRef, where("email", "==", email));
    const docSnap = await getDocs(q);
    const resultObj = [];
    docSnap.forEach((dataDoc) => {
      resultObj.push(dataDoc.data());
    });
    return resultObj;
  };

  // read database, all doc from collection
  async function getAllPostData(path) {
    let res = [];
    const querySnapshot = await getDocs(collection(fireStore, path));
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      res.push(doc.data());
    });
    return res;
  }

  const value = {
    signUpUserWithEmailAndPassword,
    loginWithEmailAndPassword,
    putData,
    signUpWithGoogle,
    afterUserLogin,
    singOutFun,
    createUserInDatabase,
    makeSubCollection,
    getDocument,
    getDataUsingEmail,
    getAllPostData,
  };
  return (
    <div>
      <FirebaseContextObj.Provider value={value}>
        {props.children}
      </FirebaseContextObj.Provider>
    </div>
  );
};
export { FirebaseContextObj };
