import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  userName: string | null;
  openAuthForm: boolean;
  successRegister:boolean;
}

const initialState: AuthState = {
  userName: null,
  openAuthForm: false,
  successRegister:false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserName(state, action: PayloadAction<string | null>) {
      state.userName = action.payload;
    },
    toggleAuthForm(state) {
      state.openAuthForm = !state.openAuthForm;
    },
    openAuthForm(state) {
      state.openAuthForm = true;
    },
    closeAuthForm(state) {
      state.openAuthForm = false;
    },
    setSuccessRegister(state, action: PayloadAction<boolean>) {
      state.successRegister = action.payload
    },
    closeSuccessRegister(state) {
      state.successRegister = false
    },
  },
});

export const { setUserName, toggleAuthForm, openAuthForm, closeAuthForm, setSuccessRegister, closeSuccessRegister } = authSlice.actions;

export default authSlice.reducer;