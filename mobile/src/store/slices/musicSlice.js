import { createSlice } from '@reduxjs/toolkit';

const musicSlice = createSlice({
  name: 'music',
  initialState: {
    currentPlaylist: null,
    isPlaying: false,
  },
  reducers: {
    setPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
  },
});

export const { setPlaylist, togglePlay } = musicSlice.actions;
export default musicSlice.reducer;
