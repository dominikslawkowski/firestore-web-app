import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import "@firebase/analytics";

import firebaseConfig from "../config/how-to-frontend-firebase";

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const FieldValue = firebase.firestore.FieldValue;
export const analytics = firebase.analytics();

export const authenticateAnonymously = () => {
  return firebase.auth().signInAnonymously();
};
