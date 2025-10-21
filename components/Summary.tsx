import React from 'react';
import type { SummaryData } from '../types';

interface SummaryProps {
    data: SummaryData;
    onDataChange: (key: keyof SummaryData, value: string | number) => void;
    netCharges: number;
    netPl: number;
    inrRate: number;
}

const formatCurrency = (value: number, currency: 'USD' | 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};


const Summary: React.FC<SummaryProps> = ({ data, onDataChange, netCharges, netPl, inrRate }) => {
    
    const summaryItems = [
        { label: 'Capital', usd: data.capital, inr: data.capital * inrRate, editable: true, key: 'capital' as const, display: 'currency', color: 'text-primary' },
        { label: 'Total Trading Days', usd: data.totalTradingDays, editable: true, key: 'totalTradingDays' as const, display: 'number', color: 'text-primary' },
        { label: 'Qty / Lot', usd: data.qtyPerLot, editable: true, key: 'qtyPerLot' as const, display: 'number', color: 'text-primary' },
        { label: 'Working Capital', usd: data.workingCapital, inr: data.workingCapital * inrRate, editable: true, key: 'workingCapital' as const, display: 'currency', color: 'text-primary' },
        { label: 'Avg. Asset Movement', usd: data.avgAssetMovement, editable: true, key: 'avgAssetMovement' as const, display: 'percent', color: 'text-tertiary' },
        { label: 'Max Trade PerDay', usd: data.maxTradePerDay, editable: true, key: 'maxTradePerDay' as const, display: 'number', color: 'text-primary' },
        { label: 'SL PerTrade', usd: data.slPerTrade, inr: data.slPerTrade * inrRate, editable: true, key: 'slPerTrade' as const, display: 'currency', color: 'text-danger' },
        { label: 'TP PerTrade', usd: data.tpPerTrade, inr: data.tpPerTrade * inrRate, editable: true, key: 'tpPerTrade' as const, display: 'currency', color: 'text-success' },
        { label: 'P&L Ratio', usd: data.plRatio, editable: true, key: 'plRatio' as const, display: 'text', color: 'text-primary' },
    ];
    
    return (
        <div className="bg-background-secondary border border-border text-xs sm:text-sm rounded-lg shadow-lg shadow-shadow">
            <div className="grid grid-cols-3 bg-surface font-bold rounded-t-lg">
                <div className="col-span-1 p-1 sm:p-1.5"></div>
                <div className="col-span-1 p-1 sm:p-1.5 text-center text-text-secondary">USD</div>
                <div className="col-span-1 p-1 sm:p-1.5 text-center text-text-secondary">INR</div>
            </div>
            <div className="divide-y divide-border">
                {summaryItems.map((item, index) => {
                    const isNumberInput = item.display === 'currency' || item.display === 'number' || item.display === 'percent';
                    const hasInr = typeof item.inr === 'number';

                    return (
                        <div key={index} className="grid grid-cols-3 items-center">
                            <div className={`col-span-1 p-1 sm:p-1.5 text-text-secondary`}>{item.label}</div>
                            <div className={`col-span-1 p-1 sm:p-1.5 font-bold ${item.color}`}>
                                {item.editable ? (
                                    item.key === 'plRatio' ? (
                                        (() => {
                                            const [part1 = '', part2 = ''] = String(item.usd).split(':');
                                            const handleRatioChange = (part: 1 | 2, value: string) => {
                                                const newRatio = part === 1 ? `${value}:${part2}` : `${part1}:${value}`;
                                                onDataChange(item.key, newRatio);
                                            };
                                            return (
                                                <div className="flex items-center justify-end">
                                                    <input
                                                        type="number"
                                                        value={part1}
                                                        onChange={(e) => handleRatioChange(1, e.target.value)}
                                                        className="w-12 sm:w-16 bg-transparent focus:outline-none text-right appearance-none"
                                                        style={{ MozAppearance: 'textfield' }}
                                                    />
                                                    <span className="px-1 select-none">:</span>
                                                    <input
                                                        type="number"
                                                        value={part2}
                                                        onChange={(e) => handleRatioChange(2, e.target.value)}
                                                        className="w-12 sm:w-16 bg-transparent focus:outline-none text-left appearance-none"
                                                        style={{ MozAppearance: 'textfield' }}
                                                    />
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="flex items-center justify-end">
                                            {item.display === 'currency' && <span>$</span>}
                                            <input
                                                type={isNumberInput ? "number" : "text"}
                                                step={isNumberInput ? "0.01" : undefined}
                                                value={item.usd}
                                                onChange={(e) => onDataChange(item.key, isNumberInput ? parseFloat(e.target.value) || 0 : e.target.value)}
                                                className="w-full bg-transparent focus:outline-none text-right appearance-none"
                                                style={{MozAppearance: 'textfield'}}
                                            />
                                            {item.display === 'percent' && <span>%</span>}
                                        </div>
                                    )
                                ) : (
                                    <div className="text-right">
                                        {
                                          item.display === 'currency' ? formatCurrency(item.usd as number, 'USD') :
                                          item.display === 'percent' ? `${item.usd}%` :
                                          item.usd
                                        }
                                    </div>
                                )}
                            </div>
                            <div className="col-span-1 p-1 sm:p-1.5 text-right text-secondary">
                                {hasInr ? formatCurrency(item.inr, 'INR') : ''}
                            </div>
                        </div>
                    );
                })}
                <div className="grid grid-cols-3 pt-4">
                     <div className="col-span-1 p-1 sm:p-1.5">Net Charges</div>
                     <div className="col-span-1 p-1 sm:p-1.5 font-bold text-danger flex justify-end items-center">
                        <span>$</span>
                        <span className="ml-0.5">{formatValue(netCharges)}</span>
                     </div>
                     <div className="col-span-1 p-1 sm:p-1.5 text-right text-secondary">{formatCurrency(netCharges * inrRate, 'INR')}</div>
                </div>
                <div className="grid grid-cols-3">
                     <div className="col-span-1 p-1 sm:p-1.5">Net P&L</div>
                     <div className={`col-span-1 p-1 sm:p-1.5 font-bold ${netPl >= 0 ? 'text-success' : 'text-danger'} flex justify-end items-center`}>
                        {netPl < 0 && <span>-</span>}
                        <span>$</span>
                        <span className="ml-0.5">{formatValue(Math.abs(netPl))}</span>
                     </div>
                     <div className="col-span-1 p-1 sm:p-1.5 text-right text-secondary">{formatCurrency(netPl * inrRate, 'INR')}</div>
                </div>
                <div className="h-10"></div>
            </div>
        </div>
    );
};

export default Summary;