import { useState, useEffect } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      // Default to dark mode if no theme is saved in local storage
      return localStorage.getItem("theme") || "dark";
    }
    return "dark"; // Default to dark mode server-side
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

