// ==================== 📦 FIREBASE AUTHENTICATION SDK IMPORTS ====================
import {
  createUserWithEmailAndPassword, // Firebase server par email aur password se naya user account banane ka function (Signup)
  fetchSignInMethodsForEmail, // Kisi email ko check karne ke liye ke kya is par pehle se koi account bana hua hai ya nahi
  onAuthStateChanged, // Live Listener hook jo automatic pata lagata hai ke user kab login hua aur kab logout hua
  sendPasswordResetEmail, // User agar password bhool jaye, toh usay email par password reset link bhejne wala function
  signInWithEmailAndPassword, // Pehle se bane hue account ko email aur password check karke login karwane wala function
  signOut, // User ka active session khatam karke app se logout karne ka tareeqa
} from "firebase/auth";

// ==================== 🗄️ FIREBASE REALTIME DATABASE SDK IMPORTS ====================
import { get, ref, set } from "firebase/database"; // Realtime database se data read (get) karne aur write/save (set) karne ke tool math methods

// ==================== ⚛️ REACT CORE HOOKS IMPORTS ====================
import { createContext, useContext, useEffect, useState } from "react"; // Context API create karne aur local reactive states handle karne ke tools

// ==================== 🔧 FIREBASE SERVICE INSTANCES ====================
import { auth, database } from "../config/firebase"; // Jo configuration file humne pehle banayi thi, wahan se auth aur db connectors import kiye

// ==================== 🌐 CONTEXT CREATION ====================
// AuthContext: Ek global data box/bucket banaya jiske andar user ki state aur auth functions pure project ke liye band hain
const AuthContext = createContext({});

// useAuth: Custom hook banayi taake kisi bhi screen (jaise Login ya Profile screen) par sirf 'useAuth()' likh kar saara data mil sake
export const useAuth = () => useContext(AuthContext);

// ==================== 🏛️ MAIN AUTH PROVIDER WRAPPER ====================
// AuthProvider: Yeh component poori app ko apne andar lapet leta hai (wrap karta hai) taake sab ko data supply ho sake
export const AuthProvider = ({ children }) => {
  // 1. user state: Isme Firebase se mili hui raw system information hoti hai (jaise user unique ID, email registration state tokens)
  const [user, setUser] = useState(null);

  // 2. userProfile state: Isme user ka personal database data hota hai (Full Name, Address, Phone Number etc.)
  const [userProfile, setUserProfile] = useState(null);

  // 3. loading state: Jab tak app start hote hi user ka session check kar rahi hoti hai, tab tak spinner show karne ke liye flag
  const [loading, setLoading] = useState(true);

  // ==================== 🔄 LIVE AUTH SESSION TRACKER HOOK ====================
  useEffect(() => {
    // onAuthStateChanged: Yeh function background mein hamesha jagta rehta hai. Jab bhi login status badalta hai, yeh trigger hota hai
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // CASE A: User login hai ya usne abhi signup kiya hai
        setUser(firebaseUser); // Raw user session data state mein save kiya
        await fetchUserProfile(firebaseUser.uid); // Database se us user ka custom profile profile table data nikalne ka trigger
      } else {
        // CASE B: User logged out hai ya usne session clear kar diya hai
        setUser(null); // State empty clear
        setUserProfile(null); // Profile content card resets
      }
      setLoading(false); // Jaise hi initial verification verification loop complete ho, loader screen disable ho jaye
    });

    return unsubscribe; // Cleanup Routine: Jab component destroy ho, toh background listener ko band kar do memory leaks se bachne ke liye
  }, []);

  // ==================== 🔍 FETCH PROFILE DATABASE METHOD ====================
  const fetchUserProfile = async (uid) => {
    try {
      // ref(database, `users/${uid}`): Database ke andar users node mein specific UID wale folder ka rasta (path Reference) banaya
      // get(): Us raste par ja kar pure data ka ek snapshot (photo/copy) khench kar le aaya
      const snapshot = await get(ref(database, `users/${uid}`));

      if (snapshot.exists()) {
        setUserProfile(snapshot.val()); // snapshot.val(): Agar snapshot mein data majood hai, toh state box ko update kar diya
      }
    } catch (error) {
      console.error("Error fetching user profile:", error); // Network errors handling logs print
    }
  };

  // ==================== 📝 REGISTER / SIGNUP CONTROLLER ====================
  const register = async (fullName, email, password) => {
    // SECURITY CHECK: Email verification double checking
    // fetchSignInMethodsForEmail: Yeh check karega ke kya yeh email pehle se register toh nahi hai?
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      // Agar methods length zero se barh jaye, iska matlab account pehle se bana hua hai, error throw kar do
      throw new Error(
        "An account with this email already exists. Please log in.",
      );
    }

    // STEP 1: Firebase standard core register method crash query fire kiya
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // STEP 2: Ek naya custom profile object schema design blueprint ready kiya empty defaults ke sath
    const profile = {
      uid: cred.user.uid, // User unique ID token referencing
      fullName,
      email,
      phone: "", // Khaali placeholders baad mein edit profile screen par bharne ke liye
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
      createdAt: Date.now(), // Server generation local device timing timestamps log entry
    };

    // STEP 3: set() method ke zariye database mein `users/USER_UID` ke folder path par yeh naya profile data write kar diya
    await set(ref(database, `users/${cred.user.uid}`), profile);

    setUserProfile(profile); // Instant local state layout component content synchronous backup update
    return cred; // Returns network credential raw response blocks values tokens back to signup page triggers
  };

  // ==================== 🔑 LOGIN CONTROLLER METHOD ====================
  const login = async (email, password) => {
    // Email aur password bhej kar authentication token handshake process verify kiya
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ==================== 🚪 LOGOUT SYSTEM CONTROLLER ====================
  const logout = async () => {
    // Session status token links delete action dispatch methods commands execution runtime
    await signOut(auth);
  };

  // ==================== 🛠️ FORGOT PASSWORD DISPATCH ENGINE ====================
  const forgotPassword = async (email) => {
    // VALIDATION ROADS: Pehle verify karo ke kya is email ka koi account database mein hai bhi ya nahi?
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length === 0) {
      throw new Error("No account found with this email address."); // Agar record zero ho, toh popup warning trigger ho jaye
    }
    // Agar account majood hai, toh Firebase server us email par password reset karne ka official link bhej dega
    return sendPasswordResetEmail(auth, email);
  };

  // ==================== 🔄 UPDATE USER PROFILE DISPATCH CONTROLLER ====================
  const updateProfile = async (data) => {
    if (!user) return; // Safeguard check barrier: Agar koi user logged-in hi nahi hai, toh return skip bypass out

    // ...userProfile (Shallow copying) + ...data (New user values input merging payload blocks)
    const updated = { ...userProfile, ...data };

    // Database reference matching endpoint targets nodes par naya updated object push kar diya
    await set(ref(database, `users/${user.uid}`), updated);

    setUserProfile(updated); // App memory ui refresh counters triggers sync update executed
  };

  // ==================== ⚡ FORCE PROFILE REFRESH ROUTINE ====================
  const refreshProfile = async () => {
    // Agar user logged in hai, toh manual database API calling reload fetch process complete karega
    if (user) await fetchUserProfile(user.uid);
  };

  // ==================== 🎁 PROVIDER GLOBAL EXPORT COMPONENT LAYER ====================
  return (
    // Provider Value Bundle Matrix: Is value block bracket ke andar jitne bhi variables aur functions likhe hain,
    // woh poori app ki kisi bhi sub-screen (Child screen) par bina re-wiring direct use kiye ja sakte hain!
    <AuthContext.Provider
      value={{
        user, // User session objects identity tracking storage fields
        userProfile, // Complete database details structure records logs fields
        loading, // System boot spinner active/deactive tracking state flags
        register, // Signup dispatcher system method link
        login, // Core credentials checking router link
        logout, // Active token disposal execution terminal link
        forgotPassword, // Password reset mail forwarding management method
        updateProfile, // Profile edits editing database syncing tools link
        refreshProfile, // External pull-to-refresh triggers logic pipeline
      }}
    >
      {/* {children} ka matlab hai aapke pure project ki screens (Home, Profile, Login) is context box ke pet ke andar safe rhengi */}
      {children}
    </AuthContext.Provider>
  );
};
