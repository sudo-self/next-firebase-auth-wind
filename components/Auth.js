// components/Auth.js
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";

export const Auth = ({ user }) => {
  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
  const signInWithGitHub = () => signInWithPopup(auth, githubProvider);

  return user ? (
    <div>
      <p>Welcome, {user.displayName}</p>
      <button onClick={() => signOut(auth)}>Sign out</button>
    </div>
  ) : (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={signInWithGitHub}>Sign in with GitHub</button>
    </div>
  );
};

