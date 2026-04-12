"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  accentColor: string;
  toggleTheme: () => void;
  setAccentColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_ACCENT_COLOR = "#ec7211";

const normalizeHexColor = (color: string): string => {
  const value = color.trim();
  const shortHex = /^#([0-9a-fA-F]{3})$/;
  const fullHex = /^#([0-9a-fA-F]{6})$/;

  if (shortHex.test(value)) {
    return `#${value
      .slice(1)
      .split("")
      .map((char) => `${char}${char}`)
      .join("")
      .toLowerCase()}`;
  }

  if (fullHex.test(value)) {
    return value.toLowerCase();
  }

  return DEFAULT_ACCENT_COLOR;
};

const hexToRgb = (hex: string) => {
  const normalized = normalizeHexColor(hex).slice(1);
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16)
  };
};

const mixRgb = (
  from: { r: number; g: number; b: number },
  to: { r: number; g: number; b: number },
  weight: number
) => ({
  r: Math.round(from.r * (1 - weight) + to.r * weight),
  g: Math.round(from.g * (1 - weight) + to.g * weight),
  b: Math.round(from.b * (1 - weight) + to.b * weight)
});

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const clamp = (n: number) => Math.max(0, Math.min(255, n));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
};

const applyAccentTheme = (accentColor: string) => {
  const root = document.documentElement;
  const base = hexToRgb(accentColor);
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  const vars: Record<string, string> = {
    "--color-brand-25": rgbToHex(mixRgb(base, white, 0.95)),
    "--color-brand-50": rgbToHex(mixRgb(base, white, 0.9)),
    "--color-brand-100": rgbToHex(mixRgb(base, white, 0.75)),
    "--color-brand-200": rgbToHex(mixRgb(base, white, 0.6)),
    "--color-brand-300": rgbToHex(mixRgb(base, white, 0.4)),
    "--color-brand-400": rgbToHex(mixRgb(base, white, 0.2)),
    "--color-brand-500": rgbToHex(base),
    "--color-brand-600": rgbToHex(mixRgb(base, black, 0.12)),
    "--color-brand-700": rgbToHex(mixRgb(base, black, 0.24)),
    "--color-brand-800": rgbToHex(mixRgb(base, black, 0.38)),
    "--color-brand-900": rgbToHex(mixRgb(base, black, 0.5)),
    "--color-brand-950": rgbToHex(mixRgb(base, black, 0.68)),
    "--shadow-focus-ring": `0px 0px 0px 4px rgba(${base.r}, ${base.g}, ${base.b}, 0.16)`
  };

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [accentColor, setAccentColorState] = useState<string>(DEFAULT_ACCENT_COLOR);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This code will only run on the client side
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedAccentColor = localStorage.getItem("accentColor");
    const initialTheme = savedTheme || "light"; // Default to light theme
    const initialAccentColor = normalizeHexColor(savedAccentColor || DEFAULT_ACCENT_COLOR);

    setTheme(initialTheme);
    setAccentColorState(initialAccentColor);
    applyAccentTheme(initialAccentColor);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("accentColor", accentColor);
    applyAccentTheme(accentColor);
  }, [accentColor, isInitialized]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(normalizeHexColor(color));
  };

  return (
    <ThemeContext.Provider value={{ theme, accentColor, toggleTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
