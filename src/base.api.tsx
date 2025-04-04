import React, { useContext, useMemo } from 'react';
import memoizeOne from 'memoize-one';
import { ReactReduxContext, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { defaultGetId, getKeyOf } from './helpers';
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_RISK_BECOMING_MAINTAINER } from './internal';
import type {
  CurrentMapperType,
  CurrentProviderType,
  GetInjectableId,
  InjectableKey,
  InjectableSelector,
  ValueOrSelector,
} from './types';
import { SelectCurrentsOptions } from './types';

const { injectCurrents, selectCurrents, monkeyPatchStore } =
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_RISK_BECOMING_MAINTAINER;

export const generateCurrentKey = () => Symbol('redux-current generated key');
export function composeCurrentKeySelector<DataType>(
  key: InjectableKey,
  options?: SelectCurrentsOptions,
) {
  return (state: any): DataType => selectCurrents(state, options)[key];
}

// An injector should be memoized for provider lifetime
const useLocalInjector = () => React.useMemo(() => memoizeOne(injectCurrents), []);

const _CurrentProvider: CurrentProviderType = ({ children, name, value, bulk }) => {
  const context = useContext(ReactReduxContext);

  const contextInjector = useLocalInjector();

  const values = React.useMemo(
    () => (name && typeof value !== 'undefined' ? { ...bulk, [getKeyOf(name)]: value } : bulk),
    [name, value, bulk],
  );

  const nextContext = React.useMemo(
    () => ({
      ...context,
      store: monkeyPatchStore(contextInjector, context.store, values),
    }),
    [context, contextInjector, values],
  );

  return <ReactReduxContext.Provider value={nextContext}>{children}</ReactReduxContext.Provider>;
};

// TODO-1: tests for changing selector to raw value and back
// TODO-2: convert to selectors if input is selector
// const selectDataDict = createSelector(selectDataList, convertListToObjectBy(selectId));
// const selectDataById = createSelector(
//   selectDataDict,
//   (_, { id }) => id,
//   (dict, id) => dict[id],
// );
// const selectIds = createSelector(selectDataList, (list) => list.map(selectId));

function useItemsById<T>(listOrSelector: ValueOrSelector<T[]>, getId: GetInjectableId<T>) {
  const selector = useMemo(
    () =>
      createSelector(
        (state: any) =>
          typeof listOrSelector === 'function' ? listOrSelector(state) : listOrSelector,
        (list: T[]) => list.map((item, index) => [getId(item, index), item]),
      ),
    [listOrSelector, getId],
  );
  return useSelector(selector);
}

const CurrentMapper: CurrentMapperType = ({ children, name, value, bulk }): any => {
  const list = useItemsById(
    value ?? bulk?.[getKeyOf(name)],
    (name as InjectableSelector<any>).getId ?? defaultGetId,
  );
  return list.map(([id, item]) => (
    <CurrentProvider bulk={bulk} key={id} name={name} value={item}>
      {children}
    </CurrentProvider>
  ));
};

export const CurrentProvider = Object.assign(_CurrentProvider, { Mapper: CurrentMapper });
