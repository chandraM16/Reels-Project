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
    signInWithPopup(firebaseAuth, googleProviderAuth);
  };

  //when user sign with google
  const afterUserSignWithGoogle = (setUser) => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // you are going
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
  const createUserInDatabase = async (userObj) => {
    const response = await addDoc(collection(fireStore, "users"), userObj);
    // console.log(response);
    return response;
  };

  // makeSubCollection
  const makeSubCollection = async () => {
    const response = await addDoc(
      collection(fireStore, "cities/C7HJBmt2pOcCwTgQ8x4V/areas"),
      {
        name: "BhagyaShree Nagar",
        pinCode: 440009,
        lat: 123,
        long: 2569,
      }
    );
    console.log(response);
  };

  // read database with given collection id
  const getDocument = async () => {
    const ref = doc(fireStore, "cities", "C7HJBmt2pOcCwTgQ8x4V");
    const response = await getDoc(ref);
    console.log(response.data());
  };

  // read database without collection id
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

  const value = {
    signUpUserWithEmailAndPassword,
    loginWithEmailAndPassword,
    putData,
    signUpWithGoogle,
    afterUserSignWithGoogle,
    singOutFun,
    createUserInDatabase,
    makeSubCollection,
    getDocument,
    getDataUsingEmail,
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
