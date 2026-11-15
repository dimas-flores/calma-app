import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import questionnaireReducer from './slices/questionnaireSlice';
import musicReducer from './slices/musicSlice';
import progressReducer from './slices/progressSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    questionnaire: questionnaireReducer,
    music: musicReducer,
    progress: progressReducer,
  },
});

export default store;
