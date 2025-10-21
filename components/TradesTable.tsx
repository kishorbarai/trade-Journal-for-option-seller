import React from 'react';
import type { Trade } from '../types';
import { format } from 'date-fns';
import TradeFormModal from './TradeFormModal';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';

interface TradesTableProps {
    trades: Trade[];
    onAdd: () => void;
    onEdit: (trade: Trade) => void;
    onDelete: (id: string) => void;
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    editingTrade: Trade | null;
    onSave: (trade: Trade) => void;
    selectedTradeId: string | null;
    // FIX: Correctly type the state setter prop to allow for updater functions.
    setSelectedTradeId: React.Dispatch<React.SetStateAction<string | null>>;
    qtyPerLot: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};

const TradesTable: React.FC<TradesTableProps> = ({ 
    trades, 
    onAdd, 
    onEdit, 
    onDelete, 
    isModalOpen, 
    setIsModalOpen, 
    editingTrade, 
    onSave,
    selectedTradeId,
    setSelectedTradeId,
    qtyPerLot
}) => {
    const tableHeaders = ['', 'Date', 'Contract', 'Type', 'Lot', 'Entry', 'Exit', 'Charges', 'P&L', 'Final P&L', 'Remarks'];

    const handleSelectionChange = (id: string) => {
        setSelectedTradeId(prevId => (prevId === id ? null : id));
    };

    const handleModifyClick = () => {
        if (selectedTradeId) {
            const selectedTrade = trades.find(t => t.id === selectedTradeId);
            if (selectedTrade) {
                onEdit(selectedTrade);
            }
        }
    };
    
    const handleDeleteClick = () => {
        if (selectedTradeId) {
            onDelete(selectedTradeId);
        }
    };

    return (
        <div className="bg-background-secondary border border-border overflow-x-auto rounded-lg shadow-lg shadow-shadow">
            <div className="p-2 flex justify-end items-center space-x-2">
                 <button onClick={handleModifyClick} disabled={!selectedTradeId} className="bg-tertiary hover:bg-opacity-80 text-white font-bold py-1 px-3 rounded-md flex items-center space-x-2 text-sm disabled:bg-disabled-bg disabled:cursor-not-allowed transition-all duration-300">
                    <PencilIcon />
                    <span className="hidden sm:inline">Modify</span>
                </button>
                 <button onClick={handleDeleteClick} disabled={!selectedTradeId} className="bg-danger hover:bg-opacity-80 text-white font-bold py-1 px-3 rounded-md flex items-center space-x-2 text-sm disabled:bg-disabled-bg disabled:cursor-not-allowed transition-all duration-300">
                    <TrashIcon />
                    <span className="hidden sm:inline">Delete</span>
                </button>
                <button onClick={onAdd} className="bg-success hover:bg-opacity-80 text-white font-bold py-1 px-3 rounded-md flex items-center space-x-2 text-sm transition-all duration-300">
                    <PlusIcon />
                    <span className="hidden sm:inline">Add Trade</span>
                </button>
            </div>
            <table className="w-full text-base text-left text-text-primary">
                <thead className="text-base text-text-secondary uppercase bg-surface">
                    <tr>
                        {tableHeaders.map(header => {
                            const centeredHeaders = ['', 'Contract', 'Type', 'Lot', 'Entry', 'Exit', 'Charges', 'P&L', 'Final P&L'];
                            const alignmentClass = centeredHeaders.includes(header) ? 'text-center' : '';

                            return (
                                <th key={header} scope="col" className={`px-2 sm:px-4 py-2 border-b border-l border-border font-normal ${alignmentClass}`}>
                                    {header}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {trades.map((trade) => {
                        const finalPl = trade.pl - trade.charges;
                        const contractColorClass = trade.contract.toUpperCase().startsWith('C')
                            ? 'text-[#fc7303]'
                            : trade.contract.toUpperCase().startsWith('P')
                            ? 'text-[#fca103]'
                            : 'text-primary';
                        return (
                            <tr key={trade.id} className={`hover:bg-surface-hover ${selectedTradeId === trade.id ? 'bg-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]' : ''}`}>
                                <td className="px-2 sm:px-4 py-1.5 border-l border-border text-center">
                                    <input 
                                        type="checkbox" 
                                        className="form-checkbox h-4 w-4 bg-checkbox-bg border-checkbox-border text-primary focus:ring-primary"
                                        checked={trade.id === selectedTradeId}
                                        onChange={() => handleSelectionChange(trade.id)}
                                    />
                                </td>
                                <td className="px-2 sm:px-4 py-1.5 border-l border-border">{format(new Date(trade.date), 'dd MMM yy')}</td>
                                <td className={`px-2 sm:px-4 py-1.5 border-l border-border ${contractColorClass} whitespace-nowrap text-center`}>{trade.contract}</td>
                                <td className={`px-2 sm:px-4 py-1.5 border-l border-border font-bold text-center ${trade.type === 'Buy' ? 'text-success' : 'text-danger'}`}>
                                    {trade.type}
                                </td>
                                <td className="px-2 sm:px-4 py-1.5 border-l border-border text-center">{trade.lot}</td>
                                <td className="px-2 sm:px-4 py-1.5 border-l border-border text-text-primary text-center">{trade.entry.toFixed(2)}</td>
                                <td className="px-2 sm:px-4 py-1.5 border-l border-border text-text-primary text-center">{trade.exit.toFixed(2)}</td>
                                <td className="px-2 sm:px-4 py-1.5 border-l border-border text-danger text-center">{formatCurrency(trade.charges)}</td>
                                <td className={`px-2 sm:px-4 py-1.5 border-l border-border text-center ${trade.pl >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(trade.pl)}</td>
                                <td className={`px-2 sm:px-4 py-1.5 border-l border-border font-bold text-center ${finalPl >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(finalPl)}</td>
                                <td className="px-2 sm:px-4 py-1.5 border-l border-border text-text-secondary max-w-[100px] sm:max-w-xs truncate">{trade.remarks}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
             {isModalOpen && (
                <TradeFormModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={onSave}
                    trade={editingTrade}
                    qtyPerLot={qtyPerLot}
                />
            )}
        </div>
    );
};

export default TradesTable;