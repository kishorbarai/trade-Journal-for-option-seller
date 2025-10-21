import React, { useMemo, useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { format } from 'date-fns';
import type { Trade } from '../types';

interface PnlChartProps {
    trades: Trade[];
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background-quaternary border border-border rounded-md p-3 text-base shadow-lg">
                <p className="label text-text-primary">{`Date: ${label}`}</p>
                <p className="intro" style={{ color: payload[0].payload['P&L'] >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {`Trade P&L: ${payload[0].payload['P&L'].toFixed(2)}`}
                </p>
                <p className="desc" style={{ color: payload[0].color }}>
                    {`Cumulative P&L: ${payload[0].value.toFixed(2)}`}
                </p>
            </div>
        );
    }
    return null;
};


const PnlChart: React.FC<PnlChartProps> = ({ trades }) => {
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [btcPrice, setBtcPrice] = useState<string | null>(null);
    const [priceChangeStatus, setPriceChangeStatus] = useState<'up' | 'down' | null>(null);
    const prevBtcPriceRef = useRef<number | null>(null);
    const animationTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

        ws.onopen = () => {
            console.log('BTC price WebSocket connected');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data && data.c) {
                    const price = parseFloat(data.c);

                    if (prevBtcPriceRef.current !== null) {
                        if (price > prevBtcPriceRef.current) {
                            setPriceChangeStatus('up');
                        } else if (price < prevBtcPriceRef.current) {
                            setPriceChangeStatus('down');
                        }
                    }

                    setBtcPrice(price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                    prevBtcPriceRef.current = price;

                    if (animationTimeoutRef.current) {
                        clearTimeout(animationTimeoutRef.current);
                    }
                    animationTimeoutRef.current = window.setTimeout(() => {
                        setPriceChangeStatus(null);
                    }, 1000); // Animation duration is 1s
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setBtcPrice('Error');
        };
        
        ws.onclose = () => {
            console.log('BTC price WebSocket disconnected');
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, []);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };

    const clearDate = (field: 'from' | 'to') => {
        setDateRange(prev => ({ ...prev, [field]: '' }));
    };

    const filteredTrades = useMemo(() => {
        if (!trades) return [];
        const { from, to } = dateRange;
        if (!from && !to) return trades;

        return trades.filter(trade => {
            const tradeDate = new Date(trade.date + 'T00:00:00');
            const fromDate = from ? new Date(from + 'T00:00:00') : null;
            const toDate = to ? new Date(to + 'T00:00:00') : null;

            if (fromDate && tradeDate < fromDate) return false;
            if (toDate && tradeDate > toDate) return false;
            return true;
        });
    }, [trades, dateRange]);


    const chartData = useMemo(() => {
        if (filteredTrades.length === 0) return [];

        const sortedTrades = [...filteredTrades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        let cumulativePl = 0;
        return sortedTrades.map((trade) => {
            const finalPl = trade.pl - trade.charges;
            cumulativePl += finalPl;
            return {
                name: format(new Date(trade.date + 'T00:00:00'), 'dd MMM'),
                'P&L': finalPl,
                'Cumulative P&L': cumulativePl,
            };
        });
    }, [filteredTrades]);

    const renderChart = () => {
        if (chartData.length === 0) {
            return (
                 <div className="h-full flex items-center justify-center text-text-secondary p-4">
                    No trade data available for the selected range.
                </div>
            )
        }
        
        const finalCumulativePl = chartData.length > 0 ? chartData[chartData.length - 1]['Cumulative P&L'] : 0;
        const rootStyles = getComputedStyle(document.documentElement);
        const lineColor = finalCumulativePl >= 0 ? rootStyles.getPropertyValue('--color-success') : rootStyles.getPropertyValue('--color-danger'); // Green for profit, Red for loss
        const axisColor = rootStyles.getPropertyValue('--color-text-secondary');
        const gridColor = rootStyles.getPropertyValue('--color-border');

        return (
             <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={lineColor} stopOpacity={0.4}/>
                            <stop offset="95%" stopColor={lineColor} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis 
                        dataKey="name" 
                        stroke={axisColor}
                        tick={{ fontSize: 14 }} 
                    />
                    <YAxis 
                        stroke={axisColor}
                        tick={{ fontSize: 14 }} 
                        tickFormatter={(value) => `$${value.toFixed(0)}`} 
                        domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 14, paddingTop: '20px', color: axisColor }} />
                    <Area 
                        type="monotone" 
                        dataKey="Cumulative P&L" 
                        stroke="none" 
                        fill="url(#pnlGradient)" 
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="Cumulative P&L" 
                        stroke={lineColor} 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                        dot={{ r: 4 }}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                </LineChart>
            </ResponsiveContainer>
        )
    }

    const priceAnimationClass = 
        priceChangeStatus === 'up' ? 'animate-price-up' :
        priceChangeStatus === 'down' ? 'animate-price-down' : '';

    return (
        <div className="bg-background-secondary border border-border p-2 sm:p-4 h-full min-h-[280px] sm:min-h-[300px] flex flex-col rounded-lg shadow-lg shadow-shadow">
             <div className="flex flex-wrap justify-center sm:justify-between items-center mb-4 gap-2 sm:gap-4">
                <div className="flex items-baseline gap-x-4">
                    <h3 className="text-xl font-bold text-text-secondary">Cumulative P&L</h3>
                    <div className="px-2">
                        <span className={`text-xl font-bold btc-price-text ${priceAnimationClass}`}>
                            {btcPrice ? `$${btcPrice}` : 'Loading...'}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-base">
                    <div className="flex items-center gap-2">
                        <label htmlFor="from" className="text-text-secondary">From:</label>
                        <div className="flex items-center bg-background-quaternary border border-border rounded-md">
                            <input type="date" name="from" value={dateRange.from} onChange={handleDateChange} className="bg-transparent px-2 py-1 focus:outline-none text-text-primary" />
                             {dateRange.from && <button onClick={() => clearDate('from')} className="text-text-secondary hover:text-text-primary pr-2 text-lg">×</button>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <label htmlFor="to" className="text-text-secondary">To:</label>
                        <div className="flex items-center bg-background-quaternary border border-border rounded-md">
                            <input type="date" name="to" value={dateRange.to} onChange={handleDateChange} className="bg-transparent px-2 py-1 focus:outline-none text-text-primary" />
                            {dateRange.to && <button onClick={() => clearDate('to')} className="text-text-secondary hover:text-text-primary pr-2 text-lg">×</button>}
                        </div>
                    </div>
                </div>
             </div>
             {renderChart()}
        </div>
    );
};

export default PnlChart;