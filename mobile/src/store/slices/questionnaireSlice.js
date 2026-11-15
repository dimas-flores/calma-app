import { createSlice } from '@reduxjs/toolkit';

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState: {
    currentResult: null,
    history: [],
  },
  reducers: {
    setResult: (state, action) => {
      state.currentResult = action.payload;
    },
    addToHistory: (state, action) => {
      state.history.push(action.payload);
    },
  },
});

export const { setResult, addToHistory } = questionnaireSlice.actions;
export default questionnaireSlice.reducer;
