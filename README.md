## Nextjs Firebase Auth Tailwind Shell

https://github.com/user-attachments/assets/c18c3a25-5edd-40bf-a113-efce7d18d60e

### firebase.js

```
./firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
[YOUR FIREBASE SDK]
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const db = getDatabase(app);

```
### Auth.js 

```
//components/Auth.js

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
```
### ThemeToggle.js

```
//components/ThemeToggle.js

import { useState, useEffect } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
     
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded transition-colors duration-300"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
};
```

### Comments.js

```
//components/Comments.js


import { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { db } from '../firebase';

export function Comments({ user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const commentsRef = ref(db, 'comments');

    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const commentsList = data ? Object.entries(data).map(([id, comment]) => ({ id, ...comment })) : [];
      setComments(commentsList);
    });

    return () => unsubscribe();
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (user && newComment.trim()) {
      const commentsRef = ref(db, 'comments');
      const timestamp = new Date().toISOString();
      push(commentsRef, {
        text: newComment,
        timestamp,
        uid: user.uid,
        displayName: user.displayName || 'Anonymous',
        provider: user.providerData[0]?.providerId,
      })
      .then(() => {
        setNewComment('');
      })
      .catch((error) => {
        console.error("Error adding comment: ", error);
      });
    }
  };

  return (
    <div className="p-4">
      {user && (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full max-w-xl p-2 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              required
            />
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none"
            >
              Send
            </button>
          </div>
        </form>
      )}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className={`p-4 rounded shadow-md ${comment.provider === 'google.com' ? 'bg-gray-800 dark:bg-gray-900' : comment.provider === 'github.com' ? 'bg-gray-700 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
            <p className={`text-lg ${comment.provider === 'google.com' ? 'text-gray-100 dark:text-gray-300' : comment.provider === 'github.com' ? 'text-gray-200 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
              {comment.text}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              {new Date(comment.timestamp).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })} {new Date(comment.timestamp).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### globals.css

```
//styles/globals.css

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```
### index.js

```
//pages/index.js

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { Auth } from "../components/Auth";
import { Comments } from "../components/Comments";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Home() {
  const [user] = useAuthState(auth);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <header className="p-4 flex justify-between">
        <h1>Next14 Tailwind Firebase DB</h1>
        <ThemeToggle />
      </header>
      <Auth user={user} />
      <Comments user={user} />
    </div>
  );
}

```

### _app.js
```
//pages/_app.js

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```
### NextCongig.js

```
//nextConfig.js

const nextConfig = {
  reactStrictMode: true,
 
  swcMinify: true,

 
  images: {
    domains: ['your-image-domain.com'],  
  },

  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  },
};

module.exports = nextConfig;
```


