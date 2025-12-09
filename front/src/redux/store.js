import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { associationApi } from './api/associationApi';
import { missionApi } from './api/missionApi';
import { volunteerApi } from './api/volunteerApi';
import { associationPublicApi } from './api/associationPublicApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [associationApi.reducerPath]: associationApi.reducer,
    [missionApi.reducerPath]: missionApi.reducer,
    [volunteerApi.reducerPath]: volunteerApi.reducer,
    [associationPublicApi.reducerPath]: associationPublicApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(associationApi.middleware)
      .concat(missionApi.middleware)
      .concat(volunteerApi.middleware)
      .concat(associationPublicApi.middleware),
});
