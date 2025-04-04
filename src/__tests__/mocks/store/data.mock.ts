import { IBundle, IProduct, PriceUnit } from './types.mock';

export const blackSocks: IProduct = {
  id: '101',
  title: 'Носки «Пушечех» унисекс чёрные, размер one size',
  price: { unit: PriceUnit.RUB, value: 320 },
};

export const yellowSocks: IProduct = {
  id: '102',
  title: 'Носки «Пушечех» унисекс жёлтые, размер one size',
  price: { unit: PriceUnit.RUB, value: 320 },
};

export const sockBundle: IBundle = {
  bundleId: '1001',
  title: 'Комплект носков унисекс в боксе (2 пары), размер one size',
  showDiscount: false,
  price: { unit: PriceUnit.RUB, value: 800 },
  products: [yellowSocks, blackSocks],
};

export const blackTShirt: IProduct = {
  id: '201',
  title: 'Футболка с полосами чёрная',
  price: { unit: PriceUnit.RUB, value: 2600 },
};

export const whiteTShirt: IProduct = {
  id: '202',
  title: 'Футболка с полосами белая',
  price: { unit: PriceUnit.RUB, value: 2590 },
};

export const blackLogoTShirt: IProduct = {
  id: '203',
  title: 'Футболка с логотипом билайна, чёрная',
  price: { unit: PriceUnit.RUB, value: 2599 },
};

export const whiteLogoTShirt: IProduct = {
  id: '204',
  title: 'Футболка с логотипом билайна, белая',
  price: { unit: PriceUnit.RUB, value: 2390 },
};

export const whiteBTShirt: IProduct = {
  id: '205',
  title: 'Футболка «б.» унисекс белая, размер M',
  price: { unit: PriceUnit.RUB, value: 2399 },
};

export const noTShortBundle: IBundle = {
  bundleId: '1002',
  title: 'Комплект футболок «Сэнсэйшн б.»',
  price: { unit: PriceUnit.RUB, value: 6666 },
  showDiscount: true,
  products: [whiteTShirt, whiteLogoTShirt, whiteBTShirt],
};

export const beeHoodie: IProduct = {
  id: '301',
  title: 'Худи сотрудника билайн',
  price: { unit: PriceUnit.RUB, value: 1970 },
};

export const magazineHoodie: IProduct = {
  id: '302',
  title: 'Худи белое «Панда мэгэзин»',
  price: { unit: PriceUnit.RUB, value: 3950 },
};

export const hoodieBundle: IBundle = {
  bundleId: '1003',
  title: 'Комплект «Нет худи без добра», размер L',
  showDiscount: true,
  price: { unit: PriceUnit.RUB, value: 4950 },
  products: [beeHoodie, magazineHoodie],
};

export const mockStoreData = {
  beeHoodie,
  sensationBundle: noTShortBundle,
  tShirtsCollection: [blackTShirt, whiteTShirt, blackLogoTShirt, whiteLogoTShirt, whiteBTShirt],
  highlightedBundles: [sockBundle, hoodieBundle],
  mixedCollection: [magazineHoodie, hoodieBundle, whiteLogoTShirt, yellowSocks],
};

export type MockStoreState = typeof mockStoreData;
