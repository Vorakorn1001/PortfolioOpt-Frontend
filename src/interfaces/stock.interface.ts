export interface StockData {
  _id: string;
  symbol: string;
  name: string;
  price: number;
  annual5YrsReturn: number;
  annual3YrsReturn: number;
  annual1YrReturn: number;
  ytdReturn: number;
  sector: string;
  industry: string;
  marketCap: number;
  impliedEqReturn: number | null;
}

