import StockData from './stock.interface';
import InvestorView from './view.interface';

export default interface PortfolioData {
    activePortfolio: string;
    portfolios: {
        [key: string]: {
            assets: StockData[];
            investorViews?: InvestorView[];
        };
    };
}
