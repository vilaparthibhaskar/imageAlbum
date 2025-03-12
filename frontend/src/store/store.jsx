import { configureStore } from '@reduxjs/toolkit';
import userReducer, { persistUserState } from './slice/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// ✅ Enable state persistence
persistUserState(store);

export default store;
