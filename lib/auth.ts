import { auth } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";

// Регистрация нового пользователя
export const signUp = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Вход в аккаунт
export const logIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Выход из аккаунта
export const logOut = async () => {
  return await signOut(auth);
};
