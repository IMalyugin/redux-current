import React, { useMemo } from 'react';

import { injectServices } from './helpers';
import { CurrentProvider } from './base.api';
import {
  CurrentModuleMapperType,
  CurrentModuleOptions,
  CurrentModuleType,
  InjectableAction,
  InjectableKey,
  InjectableName,
  InjectableSelector,
  ValueOrSelector,
  // WithCurrentModuleMapperType,
  // WithCurrentModuleType,
} from './types';

const useBulkInjection = <BulkValueType extends { [key: InjectableKey]: any }>(
  injectables: { [Key in keyof BulkValueType]: InjectableName<BulkValueType[Key]> },
  concreteValues: { [Key in keyof BulkValueType]: ValueOrSelector<BulkValueType[Key]> },
): BulkValueType =>
  useMemo(
    () => injectServices(injectables, concreteValues),
    Object.keys(injectables).map((key) => concreteValues[key]),
  );
/**
 * A dictionary of selectors that must be injected
 * @param injectables - a dictionary of selectors/keys to be passed
 * @param options
 */
export function createCurrentModule<
  DataKeys extends InjectableKey,
  BulkDataTypes extends { [key in DataKeys]: any },
  Primary extends DataKeys,
>(
  injectables: {
    [Key in keyof BulkDataTypes]:
      | InjectableAction<any[], any>
      | InjectableSelector<BulkDataTypes[Key]>;
  },
  options = {} as CurrentModuleOptions<Primary extends number ? never : Primary>,
) {
  const CurrentModule: React.FC<CurrentModuleType<BulkDataTypes>> = ({
    children,
    ...concreteValues
  }) => {
    const bulk = useBulkInjection(injectables, concreteValues as any);
    return (
      <CurrentProvider bulk={bulk}>
        {typeof children === 'function' ? children(bulk) : children}
      </CurrentProvider>
    );
  };

  const CurrentModuleMapper: React.FC<CurrentModuleMapperType<BulkDataTypes, Primary>> = ({
    children,
    ...concreteValues
  }) => {
    const primary =
      Object.keys(injectables).length === 1 ? Object.keys(injectables)[0] : options.primary;
    if (typeof primary === 'undefined') {
      throw new Error(
        'Unable to use CurrentProvider.Mapper, when more than one selector is used, primary must be passed as second argument',
      );
    }
    const { [primary]: primaryInjectable, ...otherInjectables } = injectables;
    const bulk = useBulkInjection(otherInjectables as any, concreteValues as any);
    return (
      <CurrentProvider.Mapper
        bulk={bulk}
        name={primaryInjectable}
        value={(concreteValues as any)[primary]}
      >
        {typeof children === 'function' ? children({ ...bulk }) : children}
      </CurrentProvider.Mapper>
    );
  };

  // const withCurrentModule: WithCurrentModuleType<BulkDataTypes, Primary> =
  //   (concreteValues) =>
  //   <P extends { [key in PropertyKey]: any }>(WrappedComponent: React.ComponentType<P>) => {
  //     const CurrentModuleRC = (props: P) => (
  //       <CurrentModule {...(concreteValues as any)}>
  //         <WrappedComponent {...props} />
  //       </CurrentModule>
  //     );
  //     const CurrentModuleMapperRC = (props: P) => (
  //       <CurrentModuleMapper {...(concreteValues as any)}>
  //         <WrappedComponent {...props} />
  //       </CurrentModuleMapper>
  //     );
  //     return Object.assign(CurrentModuleRC, { Mapper: CurrentModuleMapperRC });
  //   };
  //
  return Object.assign(CurrentModule, {
    Mapper: CurrentModuleMapper,
    //   with: withCurrentModule,
  });
}
