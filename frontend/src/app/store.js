import { configureStore } from '@reduxjs/toolkit';
import toursReducer from '../features/toursSlice';

export const store = configureStore({
  reducer: {
    tours: toursReducer,
  },
});

export default store;