// user.ts
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  session: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAction: (state, action: PayloadAction<{}>) => {
      state.user = action.payload;
    },
    setSession: (state, action: PayloadAction<string>) => {
      state.session = action.payload;
    },
    userLoggedOut: () => {
      if (process.browser && typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      return initialState;
    },
  },
});

export const { setUserAction, userLoggedOut, setSession } = userSlice.actions;

export default userSlice.reducer;
