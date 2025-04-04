import { createSelector } from 'reselect';

import { defaultGetId } from './helpers';
import { composeCurrentKeySelector, generateCurrentKey } from './base.api';
import type {
  InjectableAction,
  InjectableKey,
  InjectableSelector,
  StandardAction,
  ValueOrSelector,
} from './types';
import { StandardSelector } from './types';

const selectRootState = (state: any) => state;

/**
 * Define selector as injectable
 * @param getId {(value: any) => PropertyKey}
 * @param KEY {PropertyKey} use null for automatically generated key
 * @returns {{ KEY: PropertyKey, getId: (value: any) => PropertyKey} & OutputSelector<unknown, *, (res1: unknown, res2: unknown) => *>}
 */
export function createInjectableSelector<DataType = any>(
  getId: (item: DataType, index: number) => PropertyKey = defaultGetId,
  KEY: InjectableKey = generateCurrentKey(),
): InjectableSelector<DataType> {
  const currentSelector = createSelector(
    [selectRootState, composeCurrentKeySelector<ValueOrSelector<DataType>>(KEY)],
    (state, injectable) =>
      typeof injectable === 'function'
        ? (injectable as StandardSelector<DataType>)(state)
        : injectable,
  );
  return Object.assign(currentSelector, { KEY, getId });
}

export function createInjectableAction<ActionArgs extends any[] = any, ReturnType = any>(
  KEY: InjectableKey = generateCurrentKey(),
): InjectableAction<ActionArgs, ReturnType> {
  const currentHandler: StandardAction<ActionArgs, ReturnType> =
    (...args) =>
    (dispatch, getState) => {
      const state = getState();
      const handler = composeCurrentKeySelector<(...args: ActionArgs) => ReturnType>(KEY)(state);
      return handler(...args);
    };
  return Object.assign(currentHandler, { KEY });
}
