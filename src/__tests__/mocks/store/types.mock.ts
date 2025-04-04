export enum PriceUnit {
  RUB = 'rub',
  USD = 'usb',
}

export type IPrice = {
  unit: PriceUnit;
  value: number;
};
export type IBundle = {
  bundleId: string;
  price: IPrice;
  products: IProduct[];
  showDiscount: boolean;
  title: string;
};
export type IProduct = {
  id: string;
  price: IPrice;
  title: string;
};

export type { MockStoreState } from './data.mock';
