import { createContext, useContext, useState, ReactNode } from "react";

export interface ColorTheme {
  name: string;
  primary: string;
  accent: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  { name: "Corporate Blue", primary: "#1565C0", accent: "#D4A853" },
  { name: "Elegant Gold", primary: "#B8860B", accent: "#1A1A1A" },
  { name: "Modern Green", primary: "#2E7D32", accent: "#FFB300" },
  { name: "Executive Gray", primary: "#455A64", accent: "#78909C" },
  { name: "Royal Purple", primary: "#6A1B9A", accent: "#E1BEE7" },
  { name: "Warm Terracotta", primary: "#BF360C", accent: "#FFAB91" },
];

interface ThemeContextType {
  primaryLineColor: string;
  setPrimaryLineColor: (color: string) => void;
  accentLineColor: string;
  setAccentLineColor: (color: string) => void;
  applyTheme: (theme: ColorTheme) => void;
  customLogo: string | null;
  setCustomLogo: (logo: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [primaryLineColor, setPrimaryLineColor] = useState("#1565C0");
  const [accentLineColor, setAccentLineColor] = useState("#D4A853");
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  const applyTheme = (theme: ColorTheme) => {
    setPrimaryLineColor(theme.primary);
    setAccentLineColor(theme.accent);
  };

  return (
    <ThemeContext.Provider
      value={{
        primaryLineColor,
        setPrimaryLineColor,
        accentLineColor,
        setAccentLineColor,
        applyTheme,
        customLogo,
        setCustomLogo,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
