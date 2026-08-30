// Light and dark, as a class on the root element. Tailwind is configured `darkMode: 'class'`,
// so every `dark:` utility resolves against this one toggle.

// The stored choice wins, then the system preference. public/theme.js reads the same key
// before first paint; this owns it from mount on.

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggle: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

const STORAGE_KEY = "theme";

// Read once, at mount, from whatever public/theme.js already resolved. Reading the class it
// set rather than repeating its logic keeps the two from disagreeing.
const initialTheme = () =>
  typeof document === "undefined"
    ? true
    : document.documentElement.classList.contains("dark");

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    // Wrapped: a browser in private mode, or with site data blocked, throws on write, and a
    // theme toggle that throws is worse than one that forgets.
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
      // The choice lasts for this page only, which is the best available.
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
};
