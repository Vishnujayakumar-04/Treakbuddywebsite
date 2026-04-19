// @ts-ignore
import { initializeAuth, getAuth, getReactNativePersistence, Auth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseApp } from "./firebaseConfig";

let auth: Auth;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error: any) {
  if (error.code === 'auth/already-initialized' || error.message?.includes('already been initialized')) {
    auth = getAuth(firebaseApp);
  } else {
    // If getting persistence fails for some system reason, fallback
    auth = getAuth(firebaseApp);
  }
}

export { auth };

