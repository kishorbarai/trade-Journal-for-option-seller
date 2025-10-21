import React, { useState, useEffect, useRef } from 'react';
import type { Trade } from '../types';

interface TradeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (trade: Trade) => void;
    trade: Trade | null;
    qtyPerLot: number;
}

type FormState = {
    date: string;
    contract: string;
    type: 'Buy' | 'Sell';
    lot: string;
    entry: string;
    exit: string;
    charges: string;
    pl: string;
    remarks: string;
}

const initialFormData: FormState = {
    date: new Date().toISOString().split('T')[0],
    contract: '',
    type: 'Sell',
    lot: '',
    entry: '',
    exit: '',
    charges: '',
    pl: '',
    remarks: ''
};

const TradeFormModal: React.FC<TradeFormModalProps> = ({ isOpen, onClose, onSave, trade, qtyPerLot }) => {
    const [formData, setFormData] = useState<FormState>(initialFormData);
    
    // Refs for focus management
    const dateRef = useRef<HTMLInputElement>(null);
    const contractRef = useRef<HTMLInputElement>(null);
    const lotRef = useRef<HTMLInputElement>(null);
    const buyTypeRef = useRef<HTMLInputElement>(null);
    const entryRef = useRef<HTMLInputElement>(null);
    const exitRef = useRef<HTMLInputElement>(null);
    const chargesRef = useRef<HTMLInputElement>(null);
    const plRef = useRef<HTMLInputElement>(null);
    const remarksRef = useRef<HTMLTextAreaElement>(null);
    const saveButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (trade) {
            setFormData({
                date: trade.date,
                contract: trade.contract,
                type: trade.type,
                lot: String(trade.lot),
                entry: String(trade.entry),
                exit: String(trade.exit),
                charges: String(trade.charges),
                pl: String(trade.pl),
                remarks: trade.remarks,
            });
        } else {
             setFormData(initialFormData);
        }
    }, [trade, isOpen]);
    
    const handleKeyDown = (e: React.KeyboardEvent, nextFieldRef: React.RefObject<HTMLElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            nextFieldRef.current?.focus();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'contract') {
            let upperValue = value.toUpperCase();

            // Auto-format contract based on spacebar presses
            if (/^(C|P)\s$/.test(upperValue)) {
                // After 'C ' or 'P ', add '-BTC-'
                upperValue = `${upperValue.trim()}-BTC-`;
            } else if (/^(C|P)-BTC-\d+\s$/.test(upperValue)) {
                // After '...-BTC-PRICE ', add another '-'
                upperValue = `${upperValue.trim()}-`;
            }

            setFormData(prev => ({ ...prev, [name]: upperValue }));
        } else {
             setFormData(prev => ({
                ...prev,
                [name]: value
             }));
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tradeToSave: Trade = {
            id: trade ? trade.id : crypto.randomUUID(),
            date: formData.date,
            contract: formData.contract,
            type: formData.type,
            remarks: formData.remarks,
            lot: Number(formData.lot) || 0,
            entry: Number(formData.entry) || 0,
            exit: Number(formData.exit) || 0,
            charges: Number(formData.charges) || 0,
            pl: Number(formData.pl) || 0,
        };
        onSave(tradeToSave);
    };

    if (!isOpen) return null;

    const finalPl = (Number(formData.pl) || 0) - (Number(formData.charges) || 0);
    
    const inputClass = `w-full bg-background-quaternary border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary transition-colors border-border`;


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background-tertiary/95 border border-border rounded-lg p-4 sm:p-6 w-full max-w-2xl text-text-primary shadow-2xl shadow-shadow">
                <h2 className="text-xl font-bold mb-4">{trade ? 'Edit Trade' : 'Add New Trade'}</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                        
                        <div>
                            <label htmlFor="date" className="text-sm text-text-secondary">Date</label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} ref={dateRef} onKeyDown={(e) => handleKeyDown(e, contractRef)} />
                        </div>

                        <div className="relative">
                            <label htmlFor="contract" className="text-sm text-text-secondary">Contract</label>
                            <input 
                               type="text" 
                               id="contract" 
                               name="contract" 
                               value={formData.contract} 
                               onChange={handleChange} 
                               className={inputClass} 
                               placeholder="e.g., P-BTC-108000-260925"
                               ref={contractRef} 
                               onKeyDown={(e) => handleKeyDown(e, lotRef)}
                            />
                        </div>

                        <div>
                            <label htmlFor="lot" className="text-sm text-text-secondary">Lot</label>
                            <input type="number" id="lot" name="lot" value={formData.lot} onChange={handleChange} className={inputClass} ref={lotRef} onKeyDown={(e) => handleKeyDown(e, buyTypeRef)} />
                        </div>
                        
                        <div>
                            <label className="text-sm text-text-secondary block mb-1">Type</label>
                            <div className="flex space-x-4 h-full items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="type" 
                                        value="Buy" 
                                        checked={formData.type === 'Buy'} 
                                        onChange={handleChange}
                                        className="form-radio h-4 w-4 bg-checkbox-bg border-checkbox-border text-success focus:ring-success"
                                        ref={buyTypeRef} 
                                        onKeyDown={(e) => handleKeyDown(e, entryRef)}
                                    />
                                    <span className="ml-2 text-success">Buy</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="type" 
                                        value="Sell" 
                                        checked={formData.type === 'Sell'} 
                                        onChange={handleChange}
                                        className="form-radio h-4 w-4 bg-checkbox-bg border-checkbox-border text-danger focus:ring-danger"
                                        onKeyDown={(e) => handleKeyDown(e, entryRef)}
                                    />
                                    <span className="ml-2 text-danger">Sell</span>
                                </label>
                            </div>
                        </div>

                         <div>
                            <label htmlFor="entry" className="text-sm text-text-secondary">Entry Price</label>
                            <input type="number" step="0.01" id="entry" name="entry" value={formData.entry} onChange={handleChange} className={inputClass} ref={entryRef} onKeyDown={(e) => handleKeyDown(e, exitRef)} />
                        </div>

                         <div>
                            <label htmlFor="exit" className="text-sm text-text-secondary">Exit Price</label>
                            <input type="number" step="0.01" id="exit" name="exit" value={formData.exit} onChange={handleChange} className={inputClass} ref={exitRef} onKeyDown={(e) => handleKeyDown(e, chargesRef)} />
                        </div>
                        
                         <div>
                            <label htmlFor="charges" className="text-sm text-text-secondary">Charges</label>
                            <input type="number" step="0.01" id="charges" name="charges" value={formData.charges} onChange={handleChange} className={inputClass} ref={chargesRef} onKeyDown={(e) => handleKeyDown(e, plRef)} />
                        </div>

                        <div>
                            <label htmlFor="pl" className="text-sm text-text-secondary">P&L</label>
                            <input type="number" step="any" id="pl" name="pl" value={formData.pl} onChange={handleChange} className={inputClass} ref={plRef} onKeyDown={(e) => handleKeyDown(e, remarksRef)} />
                        </div>

                        <div>
                            <label className="text-sm text-text-secondary">Final P&L</label>
                            <div className={`w-full bg-background-quaternary border border-border rounded-md px-2 py-1 font-bold ${finalPl >= 0 ? 'text-success' : 'text-danger'}`}>
                                {finalPl.toFixed(2)}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="remarks" className="text-sm text-text-secondary">Remarks</label>
                            <textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} rows={3} className={inputClass} ref={remarksRef} onKeyDown={(e) => handleKeyDown(e, saveButtonRef)}></textarea>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col space-y-2 sm:flex-row-reverse sm:space-y-0 sm:space-x-reverse sm:space-x-3">
                        <button type="submit" className="bg-primary hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-md w-full sm:w-auto transition-all duration-300" ref={saveButtonRef}>Save Trade</button>
                        <button type="button" onClick={onClose} className="bg-border hover:bg-surface-hover text-text-primary font-bold py-2 px-4 rounded-md w-full sm:w-auto transition-all duration-300">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TradeFormModal;