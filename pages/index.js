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

