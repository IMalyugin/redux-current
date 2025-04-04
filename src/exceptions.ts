// /* eslint-disable max-classes-per-file */

export class MissingKeyProviderException extends Error {
  constructor() {
    super(
      "Attempting to access state provided by 'redux-current', " +
        'with no success, maybe you forgot to render ProvideCurrentKey in the react subtree',
    );
  }
}
