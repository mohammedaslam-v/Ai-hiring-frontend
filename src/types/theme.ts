// Theme related interfaces and types
export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}
