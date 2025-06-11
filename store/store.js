import { configureStore } from '@reduxjs/toolkit';
// import cityReducer from '../redux/features/citySlice'; 
// import cityReducer from './features/citySlice';
import formReducer from './feature/formSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      form: formReducer,
    },
    devTools: process.env.NODE_ENV !== 'production', 
  });
};