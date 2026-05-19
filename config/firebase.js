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

// initializeApp(firebaseConfig) se engine start hota hai aur yeh return mein ek live connection runtime 'app' module instance banata hai
const app = initializeApp(firebaseConfig);

// export const auth: Isko pure project mein kisi bhi login/signup screen par direct import kiya ja sakta hai
export const auth = initializeAuth(app, {
  // persistence management framework configuration logic:
  // getReactNativePersistence(AsyncStorage) se yeh faida hota hai ke user login hone ke baad agar mobile app close/kill bhi kar de,
  // toh agli dafa app kholne par uski token identity local device memory se read ho jayegi aur app usay auto-login kar degi (Dobara credentials nahi mangegi).
  persistence: getReactNativePersistence(AsyncStorage),
});

// export const database: Is instance variable module ko hum dynamic product listing nodes ya checkout management hooks data saving entries mein direct target karenge
export const database = getDatabase(app);

// Default operational instance blueprint forward export pattern setup triggers
export default app;
