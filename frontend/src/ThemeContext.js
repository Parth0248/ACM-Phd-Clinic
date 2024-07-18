// src/ThemeContext.js
import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
  const storedTheme = localStorage.getItem("theme") || "light";
  const [mode, setMode] = useState(storedTheme);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
