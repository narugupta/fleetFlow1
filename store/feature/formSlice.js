// store/feature/formSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        date_input: new Date().toISOString().split("T")[0],
        hour: 12,
        zone: "North_zone",
        weather: "Foggy",
        goods_type: "Chemicals",
    },
}

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setForminput: (state, action) => { // <-- Renamed to setForminput
            state.value = action.payload;
        },
    },
});

export const { setForminput } = formSlice.actions; // Now this correctly exports setForminput
export default formSlice.reducer;