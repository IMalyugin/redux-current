import React from 'react';
import { Provider, connect } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { StepDefinitions, autoBindSteps, loadFeature } from 'jest-cucumber';
import JsxParser from 'react-jsx-parser';

import { MockText } from './mocks/MockText';
import { createMockStore } from './mocks/internals.mock';
import { CurrentProvider, createCurrentModule, createInjectableSelector } from '..';
import { executeSafely, zipArgs } from './utils/helpers';
import { IBundle, IProduct, MockStoreState, PriceUnit } from './mocks/store/types.mock';
import {
  selectBeeHoodie,
  selectBeeHoodiePriceUnit,
  selectBeeHoodiePriceValue,
  selectBeeHoodieTitle,
  selectSensationBundle,
} from './mocks/store/selectors.mock';
import { beeHoodie, mockStoreData } from './mocks/store/data.mock';

// const selectPriceData = (state: IBundle | IProduct) => state.price;
// const selectPriceValue = (state: IBundle | IProduct) => selectPriceData(state).value;
// const selectPriceUnit = (state: IBundle | IProduct) => selectPriceData(state).unit;
// const selectBundleProducts = (state: IBundle) => state.products;
// const selectTitle = (state: IBundle | IProduct) => state.title;
/**
 * TODO: Add optimization tests - count of renders
 */
const reduxCurrentModuleSteps: StepDefinitions = ({ given, when, then }) => {
  const PriceHC: React.FC<any> = connect((state: MockStoreState) => ({
    tagName: 'price',
    children: `${selectBeeHoodiePriceValue(state)} ${selectBeeHoodiePriceUnit(state)}`,
  }))(MockText);

  const TitleHC: React.FC<any> = connect((state: MockStoreState) => ({
    tagName: 'title',
    children: selectBeeHoodieTitle(state),
  }))(MockText);

  // const loginClickFn = jest.fn();
  // const regionClickFn = jest.fn();
  // onLoginClick={loginClickFn}
  // onRegionClick={() => regionClickFn()}
  // const selectBasketId = createInjectableSelector();

  const selectProduct = createInjectableSelector<IProduct>();
  const selectProductTitle = (state: MockStoreState) => selectProduct(state).title;
  const selectProductPrice = (state: MockStoreState) => selectProduct(state).price;
  const selectProductPriceValue = (state: MockStoreState) => selectProductPrice(state).value;
  const selectProductPriceUnit = (state: MockStoreState) => {
    const { unit } = selectProductPrice(state);
    return unit === PriceUnit.RUB ? 'руб.' : unit;
  };

  const PriceRC: React.FC<any> = connect((state: MockStoreState) => ({
    children: `${selectProductPriceValue(state)} ${selectProductPriceUnit(state)}`,
  }))(MockText);

  const TitleRC: React.FC<any> = connect((state: MockStoreState) => ({
    children: selectProductTitle(state),
  }))(MockText);

  /** Bundle */
  const selectBundle = createInjectableSelector<IBundle>();
  const ProductModule = createCurrentModule(
    {
      product: selectProduct,
      // bundle: selectBundle,
    },
    { primary: 'product' },
  );

  const selectBundlePrice = (state: MockStoreState) => selectBundle(state).price;
  const selectBundlePriceValue = (state: MockStoreState) => selectBundlePrice(state).value;
  const selectBundlePriceUnit = (state: MockStoreState) => {
    const { unit } = selectBundlePrice(state);
    return unit === PriceUnit.RUB ? 'руб.' : unit;
  };

  const selectBundleTitle = (state: MockStoreState) => selectBundle(state).title;
  const selectBundleProductsList = (state: MockStoreState) => selectBundle(state).products;

  const selectBundleProductOne = (state: MockStoreState) => selectBundleProductsList(state)[0];

  const BundleTitleRC: React.FC<any> = connect((state: MockStoreState) => ({
    children: selectBundleTitle(state),
  }))(MockText);

  const BundlePriceRC: React.FC<any> = connect((state: MockStoreState) => ({
    children: `${selectBundlePriceValue(state)} ${selectBundlePriceUnit(state)}`,
  }))(MockText);

  // const selectHighlightProduct = (state: any) => state.highlightProduct;
  const BundleModule = createCurrentModule({ bundle: selectBundle });

  // const ProductModuleRC = ProductModule.with({ product: selectBundleProductOne })(
  //   ({ priceTestId, titleTestId }: { priceTestId: string; titleTestId: string }) => (
  //     <>
  //       <TitleRC testId={titleTestId} />
  //       <PriceRC testId={priceTestId} />
  //     </>
  //   ),
  // );

  let TestSnippet: React.FC<any>;
  let rerender: (ui: React.ReactElement) => void;
  let renderError: Error;

  beforeEach(() => {
    renderError = undefined as any;
    rerender = undefined as any;
    TestSnippet = undefined as any;
  });

  given('JSX', (jsxCode) => {
    TestSnippet = (props) => (
      <Provider store={createMockStore(mockStoreData)}>
        <JsxParser
          allowUnknownElements={false}
          bindings={{
            ...props,
            selectBeeHoodie,
            beeHoodie,
            selectBundleProductsList,
            selectSensationBundle,
            selectBundleProductOne,
          }}
          components={
            {
              PriceHC,
              TitleHC,
              PriceRC,
              TitleRC,
              BundlePriceRC,
              BundleTitleRC,
              ProductModule,
              // ProductModuleRC,
              BundleModule,
              CurrentProvider,
            } as any
          }
          jsx={jsxCode}
          onError={(err: Error): void => {
            throw err;
          }}
        />
      </Provider>
    );
  });

  when(/^Initially rendering(?: with (\w+)=(.*?)(?: and (\w+)=(.*?))*)?$/, (...args) => {
    [{ rerender }, renderError] = executeSafely(() => render(<TestSnippet {...zipArgs(args)} />));
  });

  when(/^Rerendering with (\w+)=(.*?)(?: and ([^=]+?)=(.*))*$/, (...args) => {
    [, renderError] = executeSafely(() => rerender(<TestSnippet {...zipArgs(args)} />));
  });

  then(/^Content of (.+) should be "(.*)"$/, (testId, expected) => {
    if (renderError) throw renderError;
    expect(screen.getByTestId(testId).textContent).toEqual(expected);
  });

  then(/^Contents of (.+) should be (\[[\w\W]*])$/, (testId, expected) => {
    if (renderError) throw renderError;
    expect(screen.getAllByTestId(testId).map((item) => item.textContent)).toEqual(
      JSON.parse(expected),
    );
  });

  then(/^(\w+) should be thrown$/, (errorName) => {
    expect(renderError?.constructor?.name).toEqual(errorName);
  });

  // it('should not throw', () => {
  //   const moduleVale = (
  //     <ProductModule product={{ id: '1', price: { value: 123, unit: PriceUnit.USD }, title: 'hi' }}>
  //       123
  //     </ProductModule>
  //   );
  //
  //   const moduleSelector = (
  //     <ProductModule
  //       product={() => ({ id: '1', price: { value: 123, unit: PriceUnit.USD }, title: 'hi' })}
  //     >
  //       123
  //     </ProductModule>
  //   );
  //
  //   const moduleValueMapper = (
  //     <ProductModule.Mapper
  //       // bundle={{ price: { value: 123, unit: PriceUnit.USD } as IPrice }}
  //       product={[{ id: '1', price: { value: 123, unit: PriceUnit.USD }, title: 'hi' }]}
  //     >
  //       123
  //     </ProductModule.Mapper>
  //   );
  //
  //   const moduleSelectorMapper = (
  //     <ProductModule.Mapper
  //       bundle={[{ price: { value: 123, unit: PriceUnit.USD } as IPrice }]}
  //       product={() => [{ id: '1', price: { value: 123, unit: PriceUnit.USD }, title: 'hi' }]}
  //     >
  //       123
  //     </ProductModule.Mapper>
  //   );
  // });

  // it('should morph well', async () => {
  //   const project = await createProject({ useInMemoryFileSystem: false, tsConfigFilePath:  });
  //
  //   const myClassFile = project.createSourceFile(
  //     path.join(__dirname, 'MyClass.ts'),
  //     `
  //       import { createInjectableSelector } from '..';
  //       const ProductModule = createInjectableSelector();
  //       <ProductModule.Mapper
  //         bundle={{ price: { value: 123, unit: PriceUnit.USD } as IPrice }}
  //         product={[{ id: '1', price: { value: 123, unit: PriceUnit.USD }, title: 'hi' }]}
  //       >
  //         123
  //       </ProductModule.Mapper>'
  //     `,
  //   );
  //
  //   const program = project.createProgram();
  //   expect(
  //     ts
  //       .getPreEmitDiagnostics(program)
  //       .map((diagnostics) => diagnostics.messageText)
  //       .join('\n'),
  //   ).toEqual('123');
  //   // console.log(ts.getPreEmitDiagnostics(program));
  // });
};

const moduleFeatures = loadFeature('./features/modules.feature', { loadRelativePath: true });
autoBindSteps([moduleFeatures], [reduxCurrentModuleSteps]);
