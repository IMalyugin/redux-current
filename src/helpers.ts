import { GetInjectableId, InjectableKey, InjectableName, ValueOrSelector } from './types';

export const defaultGetId: GetInjectableId<any> = (item, index) => item?.id ?? index;

export const getKeyOf = (injectable: InjectableName<any>) =>
  typeof injectable === 'function' ? injectable.KEY : injectable;

export const injectServices = <BulkValueType extends { [key: InjectableKey]: any }>(
  injectables: { [Key in keyof BulkValueType]: InjectableName<BulkValueType[Key]> },
  serviceSelectors: { [Key in keyof BulkValueType]: ValueOrSelector<BulkValueType[Key]> },
): BulkValueType =>
  Object.entries(injectables).reduce(
    (accum, [propName, injectable]) => ({
      ...accum,
      [getKeyOf(injectable)]: serviceSelectors[propName],
    }),
    {} as BulkValueType,
  );
