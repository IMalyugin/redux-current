import React from 'react';

import {
  CurrentProvider,
  createCurrentModule,
  createInjectableSelector,
  generateCurrentKey,
} from '.';

export const initialState = {
  holidays: [1, 2, 8, 9],
  tariffList: [
    { title: 'Good', price: 9990 },
    { title: 'Better', price: 14990 },
  ],
};
const selectMyTariff = (state: any) => state.tariffList[0];
const selectMyTariffList = (state: any) => state.tariffList;

const TARIFF_KEY = generateCurrentKey();
const selectTariff = createInjectableSelector(undefined, TARIFF_KEY);
const selectDays = (state: any) => state.holidays;

const TariffTileModule = createCurrentModule({
  tariff: selectTariff,
});

export const Samples = ({ children }: any) => {
  return (
    <>
      {/** Raw Key Value        */}
      <CurrentProvider name={TARIFF_KEY} value={{ title: 'Hi', price: 9990 }}>
        {children}
      </CurrentProvider>

      {/** Raw Key Selector     */}
      <CurrentProvider name={TARIFF_KEY} value={selectMyTariff}>
        {children}
      </CurrentProvider>

      {/** Raw Bulk Value       */}
      <CurrentProvider bulk={{ [TARIFF_KEY]: { title: 'Hi', price: 9990 } }}>
        {children}
      </CurrentProvider>

      {/** Raw Bulk Selector    */}
      <CurrentProvider bulk={{ [TARIFF_KEY]: selectMyTariff }}>{children}</CurrentProvider>

      {/** List Key Value       */}
      <CurrentProvider.Mapper name={TARIFF_KEY} value={[{ title: 'Hi', price: 9990 }]}>
        {children}
      </CurrentProvider.Mapper>

      {/** List Key Selector    */}
      <CurrentProvider.Mapper name={TARIFF_KEY} value={selectMyTariffList}>
        {children}
      </CurrentProvider.Mapper>

      {/** List Bulk Value      */}
      <CurrentProvider.Mapper
        bulk={{ auth: 'e5ae1c', days: selectDays }}
        name={TARIFF_KEY}
        value={[{ title: 'Hi', price: 9990 }]}
      >
        {children}
      </CurrentProvider.Mapper>

      {/** List Bulk Value ALT  */}
      <CurrentProvider.Mapper
        bulk={{ auth: 'e5ae1c', days: selectDays }}
        name={TARIFF_KEY}
        value={[{ title: 'Hi', price: 9990 }]}
      >
        {children}
      </CurrentProvider.Mapper>

      {/** List Bulk Selector   */}
      <CurrentProvider.Mapper
        bulk={{ auth: 'e5ae1c', days: [1, 2, 8, 9] }}
        name={TARIFF_KEY}
        value={selectMyTariffList}
      >
        {children}
      </CurrentProvider.Mapper>

      {/** Raw Module Value     */}
      <TariffTileModule tariff={{ title: 'Hi', price: 9990 }}>{children}</TariffTileModule>

      {/** Raw Module Selector  */}
      <TariffTileModule tariff={selectMyTariff}>{children}</TariffTileModule>

      {/** List Module Value    */}
      <TariffTileModule.Mapper tariff={[{ title: 'Hi', price: 9990, id: '001' }]}>
        {children}
      </TariffTileModule.Mapper>

      {/** List Module Selector */}
      <TariffTileModule.Mapper tariff={selectMyTariffList}>{children}</TariffTileModule.Mapper>
    </>
  );
};
