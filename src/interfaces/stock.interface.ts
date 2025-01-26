export default interface StockData {
    id: string;
    symbol: string;
    name: string;
    price: number;
    annual5YrsReturn: number;
    annual3YrsReturn: number;
    annual1YrReturn: number;
    ytdReturn: number;
    volatility: number;
    momentum: number;
    beta: number;
    sector: string;
    industry: string;
    marketCap: number;
    priorReturn: number | null;
    posteriorReturn: number | null;
}
