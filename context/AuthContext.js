import {
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../config/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const snapshot = await get(ref(database, `users/${uid}`));
      if (snapshot.exists()) {
        setUserProfile(snapshot.val());
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const register = async (fullName, email, password) => {
    // Check if email already exists
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      throw new Error(
        "An account with this email already exists. Please log in.",
      );
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const profile = {
      uid: cred.user.uid,
      fullName,
      email,
      phone: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
      createdAt: Date.now(),
    };
    await set(ref(database, `users/${cred.user.uid}`), profile);
    setUserProfile(profile);
    return cred;
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const forgotPassword = async (email) => {
    // Check if email is registered
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length === 0) {
      throw new Error("No account found with this email address.");
    }
    return sendPasswordResetEmail(auth, email);
  };

  const updateProfile = async (data) => {
    if (!user) return;
    const updated = { ...userProfile, ...data };
    await set(ref(database, `users/${user.uid}`), updated);
    setUserProfile(updated);
  };

  const refreshProfile = async () => {
    if (user) await fetchUserProfile(user.uid);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        register,
        login,
        logout,
        forgotPassword,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
