import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Summary from './components/Summary';
import TradesTable from './components/TradesTable';
import PnlChart from './components/PnlChart';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Trade, SummaryData } from './types';
import { ThemeProvider } from './contexts/ThemeContext';

const INR_CONVERSION_RATE = 85;

const initialSummaryData: SummaryData = {
    capital: 100,
    totalTradingDays: 50,
    qtyPerLot: 10,
    workingCapital: 20,
    avgAssetMovement: 2,
    maxTradePerDay: 2,
    slPerTrade: 1,
    tpPerTrade: 3,
    plRatio: '1:3',
};

// By default, no trades are present. User-inputted data will be displayed.
const initialTrades: Trade[] = [];

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

function AppContent() {
    const [persistedSummaryData, setPersistedSummaryData] = useLocalStorage<SummaryData>('tradeJournalSummary', initialSummaryData);
    const [summaryData, setSummaryData] = useState<SummaryData>(persistedSummaryData);
    const autosaveTimeoutRef = useRef<number | null>(null);

    // Sync from localStorage to local state if it changes (e.g., from another tab)
    useEffect(() => {
        setSummaryData(persistedSummaryData);
    }, [persistedSummaryData]);

    const [trades, setTrades] = useLocalStorage<Trade[]>('tradeJournalTrades', initialTrades);
    
    const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

    const calculations = useMemo(() => {
        const netCharges = trades.reduce((acc, trade) => acc + trade.charges, 0);
        const finalPl = trades.reduce((acc, trade) => acc + (trade.pl - trade.charges), 0);
        return { netCharges, finalPl };
    }, [trades]);

    const handleAddTrade = () => {
        setEditingTrade(null);
        setIsModalOpen(true);
    };

    const handleEditTrade = (trade: Trade) => {
        setEditingTrade(trade);
        setIsModalOpen(true);
    };
    
    const handleDeleteTrade = useCallback((id: string) => {
        // Removed window.confirm for direct deletion
        setTrades(prevTrades => prevTrades.filter(t => t.id !== id));
        setSelectedTradeId(null); // Reset selection after delete
    }, [setTrades]);

    const handleSaveTrade = (trade: Trade) => {
        if (editingTrade) {
            setTrades(prevTrades => prevTrades.map(t => t.id === trade.id ? trade : t));
        } else {
            setTrades(prevTrades => [...prevTrades, trade]);
        }
        setIsModalOpen(false);
        setSelectedTradeId(null); // Deselect after saving
    };

    const handleSummaryChange = (key: keyof SummaryData, value: string | number) => {
        setSummaryData(prev => ({ ...prev, [key]: value }));
    };
    
    const handleExportData = () => {
        try {
            const dataToExport = {
                summaryData: persistedSummaryData,
                trades: trades,
            };
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
            const link = document.createElement('a');
            link.href = jsonString;
            link.download = 'trade-journal-data.json';
            link.click();
        } catch (error) {
            console.error("Failed to export data:", error);
            alert("An error occurred while exporting your data.");
        }
    };

    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File content is not readable.");
                }
                const data = JSON.parse(text);

                // Basic validation
                if (data && typeof data.summaryData === 'object' && Array.isArray(data.trades)) {
                    setPersistedSummaryData(data.summaryData);
                    setTrades(data.trades);
                    alert('Data imported successfully!');
                } else {
                    throw new Error("Invalid file format. The file must contain 'summaryData' and 'trades'.");
                }
            } catch (error) {
                console.error("Failed to import data:", error);
                alert(`Failed to import data: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
            // Reset the file input value to allow re-importing the same file
            if(event.target) event.target.value = '';
        };
        reader.onerror = () => {
            alert("Error reading file.");
            if(event.target) event.target.value = '';
        }
        reader.readAsText(file);
    };


    // Debounced auto-save for summary data
    useEffect(() => {
        if (autosaveTimeoutRef.current) {
            clearTimeout(autosaveTimeoutRef.current);
        }

        autosaveTimeoutRef.current = window.setTimeout(() => {
            if (JSON.stringify(summaryData) !== JSON.stringify(persistedSummaryData)) {
                setPersistedSummaryData(summaryData);
            }
        }, 1500); // Auto-save after 1.5 seconds of inactivity

        return () => {
            if (autosaveTimeoutRef.current) {
                clearTimeout(autosaveTimeoutRef.current);
            }
        };
    }, [summaryData, persistedSummaryData, setPersistedSummaryData]);

    return (
        <div className="min-h-screen bg-background text-text-primary p-2 sm:p-4 font-['Ubuntu_Mono']">
            <div className="container mx-auto">
                <Header 
                    finalPl={calculations.finalPl} 
                    inrRate={INR_CONVERSION_RATE} 
                    onExport={handleExportData}
                    onImport={handleImportData}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="md:col-span-1">
                        <Summary 
                           data={summaryData} 
                           onDataChange={handleSummaryChange}
                           netCharges={calculations.netCharges}
                           netPl={calculations.finalPl}
                           inrRate={INR_CONVERSION_RATE}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <PnlChart trades={trades} />
                    </div>
                </div>
                <div className="mt-4">
                    <TradesTable 
                        trades={trades}
                        onAdd={handleAddTrade}
                        onEdit={handleEditTrade}
                        onDelete={handleDeleteTrade}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        editingTrade={editingTrade}
                        onSave={handleSaveTrade}
                        selectedTradeId={selectedTradeId}
                        setSelectedTradeId={setSelectedTradeId}
                        qtyPerLot={summaryData.qtyPerLot}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;