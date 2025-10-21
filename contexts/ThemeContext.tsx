import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { themes, Theme } from '../themes';

interface ThemeContextType {
    theme: Theme;
    setThemeByName: (name: string) => void;
    availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeName, setThemeName] = useLocalStorage<string>('trade-journal-theme', 'EyeLock');

    const theme = themes.find(t => t.name === themeName) || themes[0];

    useEffect(() => {
        const root = window.document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        
        // Special handling for calendar picker icon based on theme
        const isDark = theme.name.toLowerCase().includes('night') || theme.name.toLowerCase().includes('dracula') || theme.name.toLowerCase().includes('eyelock');
        root.style.setProperty('--webkit-calendar-picker-indicator-filter', isDark ? 'invert(1)' : 'none');

    }, [theme]);

    const setThemeByName = useCallback((name: string) => {
        setThemeName(name);
    }, [setThemeName]);

    return (
        <ThemeContext.Provider value={{ theme, setThemeByName, availableThemes: themes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};