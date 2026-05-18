import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBMMYj9PVF0Jcy0sKIeZvCl3MdMvZMfOO4",
  authDomain: "estore-e93d5.firebaseapp.com",
  databaseURL: "https://estore-e93d5-default-rtdb.firebaseio.com",
  projectId: "estore-e93d5",
  storageBucket: "estore-e93d5.firebasestorage.app",
  messagingSenderId: "952275491748",
  appId: "1:952275491748:web:78f4c9d66b295b9b007f31",
  measurementId: "G-58128E19TW",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const database = getDatabase(app);

export default app;
