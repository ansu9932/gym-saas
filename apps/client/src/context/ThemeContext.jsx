import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const STORAGE_KEY = "flexboard-theme";
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((previous) => (previous === "dark" ? "light" : "dark"))
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};
