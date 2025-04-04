import { configureStore } from '@reduxjs/toolkit';

const mockReducer = (state = {}) => state;
export const createMockStore = <T extends Record<string, any>>(initialState?: T) =>
  configureStore({ reducer: mockReducer, preloadedState: initialState });
