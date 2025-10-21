import React, { useState, useEffect, useRef } from 'react';
import ThemeChanger from './ThemeChanger';

interface HeaderProps {
    finalPl: number;
    inrRate: number;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const formatCurrency = (value: number, currency: 'USD' | 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

// Animated number component for smooth P&L updates
const AnimatedNumber = ({ value, formatFn }: { value: number; formatFn: (val: number) => string; }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const prevValueRef = useRef(value);

    useEffect(() => {
        const startValue = prevValueRef.current;
        const endValue = value;
        prevValueRef.current = value;
        
        if (startValue === endValue) {
            setDisplayValue(endValue);
            return;
        }

        let startTime: number | null = null;
        const duration = 800; // 0.8s animation

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const currentVal = startValue + (endValue - startValue) * easedProgress;
            
            setDisplayValue(currentVal);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        const handle = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(handle);

    }, [value]);

    return <>{formatFn(displayValue)}</>;
};


const Header: React.FC<HeaderProps> = ({ finalPl, inrRate, onExport, onImport }) => {
    const finalPlInr = finalPl * inrRate;
    
    // Use an effect to add the class after mount to ensure animation plays
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 10); // small delay to ensure rendering before animating
        return () => clearTimeout(timer);
    }, []);

    const pnlGlowClass = finalPl !== 0 ? 'animate-pnl-glow' : '';

    const pnlGlowStyle = finalPl > 0 
        ? { '--glow-color': 'var(--color-success-glow)', '--glow-color-accent': 'var(--color-success)' } as React.CSSProperties
        : finalPl < 0 
        ? { '--glow-color': 'var(--color-danger-glow)', '--glow-color-accent': 'var(--color-danger)' } as React.CSSProperties
        : {};


    return (
        <div className={`grid grid-cols-12 bg-background-tertiary border border-border min-h-16 items-center rounded-lg shadow-lg shadow-shadow ${isMounted ? 'header-fade-in' : 'opacity-0'}`}>
            <div className="col-span-3 lg:col-span-2 bg-background-quaternary flex items-center justify-center p-2 self-stretch rounded-l-lg">
                <h1 className="text-lg lg:text-xl font-bold text-center font-orbitron tracking-widest uppercase">
                    <span className="text-[#eaa13d] animate-glow-btc">BTC</span>
                    <br />
                    <span className="text-[#3dead7] animate-glow-options">Options</span>
                </h1>
            </div>
            {/* P&L Section: Wrapped content to apply border-radius and glow internally. */}
            <div className="col-span-9 lg:col-span-4 bg-background-tertiary flex items-center justify-center border-l border-r border-border self-stretch p-1.5">
                <div 
                   className={`w-full h-full flex flex-wrap items-center justify-center lg:justify-start px-3 transition-shadow duration-500 rounded-[10px] ${pnlGlowClass}`}
                   style={pnlGlowStyle}
                >
                    <span className="text-text-secondary font-bold pr-3 text-2xl flex-shrink-0">Final P&L:</span>
                    <span className={`text-4xl font-bold pr-3 ${finalPl >= 0 ? 'text-success' : 'text-danger'} whitespace-nowrap`}>
                        <AnimatedNumber value={finalPl} formatFn={(v) => formatCurrency(v, 'USD')} />
                    </span>
                    <span className={`text-2xl font-bold ${finalPl >= 0 ? 'text-success' : 'text-danger'} whitespace-nowrap`}>
                        <AnimatedNumber value={finalPlInr} formatFn={(v) => formatCurrency(v, 'INR')} />
                    </span>
                </div>
            </div>
             <div className="hidden lg:flex col-span-2 bg-border self-stretch items-center justify-center border-r border-border">
                <div className="text-lg font-bold text-center font-orbitron tracking-widest uppercase">
                    <span className="text-[#12acff] [text-shadow:0_0_8px_#12acff]">Lock</span>
                    <span className="text-text-primary"> </span>
                    <span className="text-[#12acff] [text-shadow:0_0_8px_#12acff]">Head ;</span>
                </div>
            </div>
            {/* Decreased column span to allocate more space to the P&L section */}
            <div className="col-span-12 lg:col-span-4 bg-background-tertiary flex items-center justify-center sm:justify-end px-4 space-x-2 py-2 lg:py-0 rounded-r-lg">
                 <ThemeChanger />
                 <label className="bg-primary hover:bg-opacity-80 text-white font-bold py-1.5 px-3 rounded-md text-sm cursor-pointer transition-all duration-300">
                    Import Data
                    <input type="file" accept=".json" onChange={onImport} className="hidden" />
                </label>
                <button onClick={onExport} className="bg-success hover:bg-opacity-80 text-white font-bold py-1.5 px-3 rounded-md text-sm transition-all duration-300">
                    Export Data
                </button>
            </div>
        </div>
    );
};

export default Header;