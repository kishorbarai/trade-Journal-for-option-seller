import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ChevronDownIcon from './icons/ChevronDownIcon';

const ThemeChanger: React.FC = () => {
    const { theme, setThemeByName, availableThemes } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeChange = (themeName: string) => {
        setThemeByName(themeName);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-background-quaternary border border-border text-text-secondary font-bold py-1.5 px-3 rounded-md text-sm flex items-center space-x-2 transition-all duration-300 hover:bg-surface-hover"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span>{theme.name}</span>
                <ChevronDownIcon />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background-tertiary border border-border rounded-md shadow-lg z-10">
                    <ul className="py-1">
                        {availableThemes.map((t) => (
                            <li key={t.name}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleThemeChange(t.name);
                                    }}
                                    className={`block px-4 py-2 text-sm ${
                                        theme.name === t.name
                                            ? 'bg-primary text-text-inverted'
                                            : 'text-text-primary hover:bg-surface-hover'
                                    }`}
                                >
                                    {t.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ThemeChanger;
