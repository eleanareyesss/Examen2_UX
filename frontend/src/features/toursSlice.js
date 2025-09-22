import {createSlice} from '@reduxjs/toolkit';

const initialState = {list: [],};
const toursSlice = createSlice({
  name: 'tours', initialState,
  reducers: {setTours: (state, action) => {state.list = action.payload || [];},},
});

export const { setTours } = toursSlice.actions;
export default toursSlice.reducer;