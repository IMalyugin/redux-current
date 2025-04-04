/* eslint-disable import/no-import-module-exports */
import type { Dispatch, Store } from 'redux';
import type { ThunkAction } from '@reduxjs/toolkit';

import { MissingKeyProviderException } from './exceptions';
import { SelectCurrentsOptions } from './types';

const ReduxCurrentsKey = '__reduxActiveCurrents';

const injectCurrents = (state: any, values: any) => ({
  ...state,
  [ReduxCurrentsKey]: {
    ...state[ReduxCurrentsKey],
    ...values,
  },
});

const barkAtMissingStoreInitialization = (suppressError = false) => {
  if (suppressError) return;
  throw new MissingKeyProviderException();
};

const blankObj = {};

const selectCurrents = (
  state: any,
  { __dangerouslySuppressError = false } = {} as SelectCurrentsOptions,
) =>
  state[ReduxCurrentsKey] ||
  barkAtMissingStoreInitialization(__dangerouslySuppressError) ||
  blankObj;

const monkeyPatchStore = (
  injector: typeof injectCurrents,
  store: Store<any, any>,
  values: any,
): Store<any, any> => {
  const getStatePatched = () => injector(store.getState(), values);

  const dispatchPatched = (action: any) => {
    if (typeof action === 'function') {
      /** monkey-patch redux-thunk */
      return store.dispatch<ThunkAction<any, any, any, any>>(
        (_dispatch: Dispatch, _getState, ...extraArgs) =>
          action(dispatchPatched, getStatePatched, ...extraArgs),
      );
    }
    return store.dispatch(action);
  };

  return {
    ...store,
    getState: getStatePatched,
    dispatch: dispatchPatched,
  };
};

/**
 * The private API might change in the future, without breaking change
 *   extend on your own risk
 * @private
 */
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_RISK_BECOMING_MAINTAINER = {
  injectCurrents,
  selectCurrents,
  monkeyPatchStore,
  ReduxCurrentsKey,
};
