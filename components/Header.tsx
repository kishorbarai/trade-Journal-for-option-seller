import React from 'react';
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

const Header: React.FC<HeaderProps> = ({ finalPl, inrRate, onExport, onImport }) => {
    const finalPlInr = finalPl * inrRate;
    
    const shadowClass = finalPl > 0 
        ? 'shadow-[0_0_15px_var(--color-success-glow)]' 
        : finalPl < 0 
        ? 'shadow-[0_0_15px_var(--color-danger-glow)]'
        : ''; // No shadow if P&L is zero

    return (
        <div className="grid grid-cols-12 bg-background-tertiary border border-border min-h-16 items-center rounded-lg shadow-lg shadow-shadow">
            <div className="col-span-3 lg:col-span-2 bg-background-quaternary flex items-center justify-center p-2 self-stretch rounded-l-lg">
                <h1 className="text-lg lg:text-xl font-bold text-center font-orbitron tracking-widest uppercase">
                    <span className="text-[#eaa13d] [text-shadow:0_0_8px_#eaa13d]">BTC</span>
                    <br />
                    <span className="text-[#3dead7] [text-shadow:0_0_8px_#3dead7]">Options</span>
                </h1>
            </div>
            {/* Increased column span for more space and added classes for better overflow handling */}
            <div className={`col-span-9 lg:col-span-4 bg-text-primary flex flex-wrap items-center justify-center lg:justify-start border-l border-r border-border self-stretch px-1 transition-shadow duration-500 ${shadowClass}`}>
                <span className="text-text-inverted font-bold px-1 sm:px-2 text-base lg:text-lg flex-shrink-0">Final P&L</span>
                <span className={`text-lg lg:text-2xl font-bold px-1 sm:px-2 ${finalPl >= 0 ? 'text-success' : 'text-danger'} whitespace-nowrap`}>
                    {formatCurrency(finalPl, 'USD')}
                </span>
                <span className={`text-base lg:text-lg font-bold px-1 sm:px-2 text-text-inverted whitespace-nowrap`}>
                    {formatCurrency(finalPlInr, 'INR')}
                </span>
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