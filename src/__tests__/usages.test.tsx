import React from 'react';
import { StepDefinitions, autoBindSteps, loadFeature } from 'jest-cucumber';
import JsxParser from 'react-jsx-parser';
import { render, screen } from '@testing-library/react';
import { Provider, connect } from 'react-redux';

import { createMockStore } from './mocks/internals.mock';
import { CurrentProvider, composeCurrentKeySelector } from '..';
import { MockText } from './mocks/MockText';
import { executeSafely, zipArgs } from './utils/helpers';

/**
 * TODO: Add optimization tests - count of renders
 */
const reduxCurrentUsageSteps: StepDefinitions = ({ given, when, then }) => {
  const MockTextRC: React.FC<any> = connect((state, ownProps: any) => ({
    children: composeCurrentKeySelector(ownProps.currentKey || 'foo')(state),
  }))(MockText);
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
      <Provider store={createMockStore()}>
        <JsxParser
          allowUnknownElements={false}
          bindings={props}
          components={{ MockTextRC, CurrentProvider }}
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

  then(/^(\w+) should be thrown$/, (errorName) => {
    expect(renderError?.constructor?.name).toEqual(errorName);
  });

  then('Error should not be thrown', () => {
    expect(renderError).toBeFalsy();
  });
};

const usageFeatures = loadFeature('./features/usages.feature', { loadRelativePath: true });
autoBindSteps([usageFeatures], [reduxCurrentUsageSteps]);
