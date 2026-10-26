import { MarketPriceItem, CropType } from '../types/index.ts';

export const KENYA_MARKET_PRICES: MarketPriceItem[] = [
  {
    id: 'mkt-tomatoes',
    crop: 'Tomatoes',
    location: 'Kisii Daraja Mbili / Nairobi Wakulima',
    pricePerUnitKes: 3400,
    unit: '64kg wooden crate',
    changePercent: 6.2,
    trend: 'rising',
    date: new Date().toISOString().split('T')[0],
    isDemo: true,
    source: 'Kenya AgriMarket Reference (KALRO & Ministry of Agriculture Wholesale Desk)',
  },
  {
    id: 'mkt-maize',
    crop: 'Maize',
    location: 'Eldoret Wholesale / Kitale Grain Hub',
    pricePerUnitKes: 4250,
    unit: '90kg dry grain bag',
    changePercent: -1.8,
    trend: 'stable',
    date: new Date().toISOString().split('T')[0],
    isDemo: true,
    source: 'National Cereals and Produce Board (NCPB) Reference',
  },
  {
    id: 'mkt-beans',
    crop: 'Beans',
    location: 'Nairobi Marikiti / Machakos Town',
    pricePerUnitKes: 9800,
    unit: '90kg bag (Rosecoco/Nyota)',
    changePercent: 3.5,
    trend: 'rising',
    date: new Date().toISOString().split('T')[0],
    isDemo: true,
    source: 'Kenya Agricultural Commodity Exchange (KACE)',
  },
  {
    id: 'mkt-potatoes',
    crop: 'Potatoes',
    location: 'Nakuru Wakulima / Nyandarua Hub',
    pricePerUnitKes: 2850,
    unit: '50kg bag (Shangi)',
    changePercent: -4.2,
    trend: 'falling',
    date: new Date().toISOString().split('T')[0],
    isDemo: true,
    source: 'National Potato Council of Kenya (NPCK)',
  },
  {
    id: 'mkt-cabbages',
    crop: 'Cabbages / Vegetables',
    location: 'Limuru Wholesale / Nairobi City Market',
    pricePerUnitKes: 48,
    unit: 'medium head (2.5kg)',
    changePercent: 2.1,
    trend: 'rising',
    date: new Date().toISOString().split('T')[0],
    isDemo: true,
    source: 'Horticultural Crops Directorate (HCD)',
  },
  {
    id: 'mkt-onions',
    crop: 'Onions',
    location: 'Nairobi Marikiti / Kajiado Gateway',
    pricePerUnitKes: 82,
    unit: 'kg (Red Creole)',
    changePercent: 5.0,
    trend: 'rising',
    date: new Date().toISOString().split('T')[0],
    isDemo: true,
    source: 'Kenya AgriMarket Wholesale Index',
  },
  {
    id: 'mkt-bananas',
    crop: 'Bananas',
    location: 'Kisii Suneka Market / Meru Hub',
    pricePerUnitKes: 880,
    unit: 'large cooking/dessert bunch',
    changePercent: 0.5,
    trend: 'stable',
    date: new Date().toISOString().split('T')[0],
    isDemo: true,
    source: 'Kisii County Agri-Marketing Cooperative',
  }
];

export function getMarketPrices(): MarketPriceItem[] {
  return KENYA_MARKET_PRICES;
}

export function getMarketPriceForCrop(crop: CropType): MarketPriceItem | undefined {
  return KENYA_MARKET_PRICES.find((m) => m.crop === crop);
}
