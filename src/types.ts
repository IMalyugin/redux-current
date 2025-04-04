import type React from 'react';
import { ThunkAction } from '@reduxjs/toolkit';

/**
 * Typescript dark magic to detect if mapped type has exactly one key
 */
type IsAny<T> = 0 extends 1 & T ? true : false;
type IsAnyOrUndefined<T> = undefined extends T ? true : false;
type IsUnion<T, U extends T = T> = T extends unknown ? ([U] extends [T] ? false : true) : false;
type HasSingleKey<T> = keyof T extends [] ? false : IsUnion<keyof T> extends true ? false : true;

export type InjectableKey = string | symbol;
export type StandardSelector<DataType> = (state: any) => DataType;
export type ValueOrSelector<DataType> = DataType | StandardSelector<DataType>;
export type SelectCurrentsOptions = { __dangerouslySuppressError: boolean };

// This type is the same as ValueOrSelector, except for the error it throws on mismatch
export type PickValueOrSelector<DataType> = DataType extends never
  ? ValueOrSelector<DataType>
  : DataType extends () => any
  ? StandardSelector<DataType>
  : DataType;

export type GetInjectableId<DataType> = (item: DataType, index: number) => PropertyKey;
export type InjectableSelector<DataType> = StandardSelector<DataType> & {
  KEY: InjectableKey;
  getId?: GetInjectableId<DataType>;
};

export type StandardAction<ActionArgs extends any[], ReturnType> = (
  ...args: ActionArgs
) => ThunkAction<ReturnType, any, any, any>;

export interface InjectableAction<ActionArgs extends any[], ReturnType>
  extends StandardAction<ActionArgs, ReturnType> {
  KEY: InjectableKey;
}
export type InjectableName<DataType> =
  | InjectableAction<any[], any>
  | InjectableKey
  | InjectableSelector<DataType>;

export type AnyBulkValueType = { [key: InjectableKey]: any };
export type CurrentProviderType<
  ValueType = any,
  BulkValueType extends AnyBulkValueType = AnyBulkValueType,
> = React.FC<{
  bulk?: { [key in keyof BulkValueType]: ValueOrSelector<BulkValueType[key]> };
  children?: React.ReactNode;
  name?: InjectableName<ValueType>;
  value?: ValueOrSelector<ValueType>;
}>;

export type CurrentMapperType<
  ValueType = any,
  BulkValueType extends AnyBulkValueType = AnyBulkValueType,
> = React.FC<{
  bulk?: { [key in keyof BulkValueType]: ValueOrSelector<BulkValueType[key]> };
  children?: React.ReactNode;
  name: InjectableName<ValueType>;
  value?: ValueOrSelector<ValueType[]>;
}>;

export type CurrentModuleOptions<Primary extends InjectableKey> = { primary?: Primary };

export type CurrentModuleType<BulkValueType extends AnyBulkValueType = AnyBulkValueType> = {
  [key in keyof BulkValueType]: ValueOrSelector<BulkValueType[key]>;
};

export type IncludePrimary<
  BulkValueType extends AnyBulkValueType,
  Primary extends keyof BulkValueType,
> = HasSingleKey<BulkValueType> extends true ? keyof BulkValueType : Primary;

export type ExcludePrimary<
  BulkValueType extends AnyBulkValueType,
  Primary extends keyof BulkValueType,
> = Exclude<
  keyof BulkValueType,
  HasSingleKey<BulkValueType> extends true ? keyof BulkValueType : Primary
>;

export type CurrentModuleMapperType<
  BulkValueType extends AnyBulkValueType,
  Primary extends keyof BulkValueType,
> = IsAny<Primary> | IsAnyOrUndefined<Primary> extends true
  ? // Short circuit, if primary is any, we can't detect if value is a single item or a list
    { [Key in keyof BulkValueType]: ValueOrSelector<BulkValueType[Key] | BulkValueType[Key][]> }
  : // Else check if BulkValueType has one key, and use that as primary
    {
      [Key in IncludePrimary<BulkValueType, Primary>]: PickValueOrSelector<BulkValueType[Key][]>;
    } & {
      // Finally if all other conditions fails, use Primary instead
      [Key in ExcludePrimary<BulkValueType, Primary>]: PickValueOrSelector<BulkValueType[Key]>;
    };

export type WithCurrentModuleType<
  BulkValueType extends AnyBulkValueType,
  Primary extends keyof BulkValueType,
> = (
  concreteValues:
    | CurrentMapperType<BulkValueType>
    | CurrentModuleMapperType<BulkValueType, Primary>,
) => <P extends { [key in PropertyKey]: any }>(
  WrappedComponent: React.ComponentType<P>,
) => React.ComponentType<P>;

export type WithCurrentModuleMapperType<
  BulkValueType extends AnyBulkValueType,
  Primary extends keyof BulkValueType,
> = (
  concreteValues:
    | CurrentMapperType<BulkValueType>
    | CurrentModuleMapperType<BulkValueType, Primary>,
) => <P extends { [key in PropertyKey]: any }>(
  WrappedComponent: React.ComponentType<P>,
) => React.ComponentType<P>;
