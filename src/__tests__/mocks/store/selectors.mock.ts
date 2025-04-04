import { MockStoreState } from './data.mock';
import { PriceUnit } from './types.mock';

/** Sensation Bundle */
export const selectSensationBundle = (state: MockStoreState) => state.sensationBundle;
export const selectSensationBundleProducts = (state: MockStoreState) =>
  selectSensationBundle(state).products;
export const selectSensationBundlePriceData = (state: MockStoreState) =>
  selectSensationBundle(state).price;
export const selectSensationBundlePrice = (state: MockStoreState) =>
  selectSensationBundlePriceData(state).value;
export const selectSensationBundleTitle = (state: MockStoreState) =>
  selectSensationBundle(state).title;

/** BeeHoodie Product */
export const selectBeeHoodie = (state: MockStoreState) => state.beeHoodie;
export const selectBeeHoodiePrice = (state: MockStoreState) => selectBeeHoodie(state).price;
export const selectBeeHoodiePriceValue = (state: MockStoreState) =>
  selectBeeHoodiePrice(state).value;
export const selectBeeHoodiePriceUnit = (state: MockStoreState) => {
  const { unit } = selectBeeHoodiePrice(state);
  return unit === PriceUnit.RUB ? 'руб.' : unit;
};
export const selectBeeHoodieTitle = (state: MockStoreState) => selectBeeHoodie(state).title;

/**
 * Collections
 */
export const selectTShirtCollection = (state: MockStoreState) => state.tShirtsCollection;
export const selectHighlightedBundles = (state: MockStoreState) => state.highlightedBundles;
export const selectMixedCollection = (state: MockStoreState) => state.mixedCollection;
