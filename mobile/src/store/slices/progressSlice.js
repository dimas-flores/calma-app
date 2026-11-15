import { createSlice } from '@reduxjs/toolkit';

const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    stats: [],
    loading: false,
  },
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setStats, setLoading } = progressSlice.actions;
export default progressSlice.reducer;
