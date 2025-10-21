
export interface Trade {
  id: string;
  date: string;
  contract: string;
  type: 'Buy' | 'Sell';
  lot: number;
  entry: number;
  exit: number;
  charges: number;
  pl: number;
  remarks: string;
}

export interface SummaryData {
  capital: number;
  totalTradingDays: number;
  qtyPerLot: number;
  workingCapital: number;
  avgAssetMovement: number;
  maxTradePerDay: number;
  slPerTrade: number;
  tpPerTrade: number;
  plRatio: string;
}