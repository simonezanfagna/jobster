import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";
import {
  addTokenToLocalStorage,
  getTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "../../utils/localStorage";
import { clearAllJobsState } from "../allJobs/allJobsSlice";
import { clearValues } from "../job/jobSlice";

const initialState = {
  isLoading: false,
  isLoadingUser: false,
  isSidebarOpen: false,
  user: null,
  token: getTokenFromLocalStorage(),
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (user, thunkAPI) => {
    /* console.log(`Register User : ${JSON.stringify(user)}`); */
    try {
      const resp = await customFetch.post("/auth/register", user);
      /* console.log(resp); */
      return resp.data;
    } catch (error) {
      /* console.log(error.response); */
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (user, thunkAPI) => {
    /* console.log(`Login User : ${JSON.stringify(user)}`); */
    try {
      const resp = await customFetch.post("/auth/login", user);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (user, thunkAPI) => {
    try {
      const resp = await customFetch.patch("/auth/updateUser", user, {
        headers: {
          // dallo stato globale (thunkAPI.getState()) ricavo il token corrispondente all'utente che ha effetuato l'accesso
          // in questo modo solo chi ha fatto il login puo' modificare i dati nel profilo
          authorization: `Bearer ${thunkAPI.getState().user.token}`,
        },
      });
      console.log(resp.data);
      return resp.data;
    } catch (error) {
      console.log(error.response);
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getUserData = createAsyncThunk(
  "user/userData",
  async (_, thunkAPI) => {
    try {
      const resp = await customFetch.get("/@me", {
        headers: {
          // dallo stato globale (thunkAPI.getState()) ricavo il token corrispondente all'utente che ha effetuato l'accesso
          // in questo modo solo chi ha fatto il login puo' modificare i dati nel profilo
          authorization: `Bearer ${thunkAPI.getState().user.token}`,
        },
      });
      console.log(resp.data);
      return resp.data;
    } catch (error) {
      if (error.response.status === 401) {
        thunkAPI.dispatch(logoutUser());
      }
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

// questa funzione viene richiamata al logout dell' utente
// imposto tutti gli stati al loro rispettivo stato iniziale e viene fatto il logout
export const clearStore = createAsyncThunk(
  "user/clearStore",
  async (user, thunkAPI) => {
    try {
      // logout user
      thunkAPI.dispatch(logoutUser(user));
      // clear jobs value
      thunkAPI.dispatch(clearAllJobsState());
      // clear job input values
      thunkAPI.dispatch(clearValues());
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state, { payload }) => {
      state.user = null;
      state.token = null;
      state.isSidebarOpen = false;
      removeTokenFromLocalStorage();
      if (payload) {
        toast.success(payload);
      }
    },
  },
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      const { user, token } = payload;
      state.isLoading = false;
      state.token = token;
      addTokenToLocalStorage(token);
      toast.success(`Ciao ${user.name}`);
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.warning(payload);
    },
    [loginUser.pending]: (state) => {
      state.isLoading = true;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      const { user, token } = payload;
      state.isLoading = false;
      state.token = token;
      addTokenToLocalStorage(token);
      toast.success(`Bentornato ${user.name}`);
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.warning(payload);
    },
    [updateUser.pending]: (state) => {
      state.isLoading = true;
    },
    [updateUser.fulfilled]: (state, { payload }) => {
      const { user, token } = payload;
      state.isLoading = false;
      state.token = token;
      state.user = user;
      addTokenToLocalStorage(token);
      toast.success("dati aggiornati");
    },
    [updateUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.warning(payload);
    },
    [clearStore.rejected]: () => {
      toast.error("errore");
    },
    [getUserData.pending]: (state) => {
      state.isLoadingUser = true;
    },
    [getUserData.fulfilled]: (state, { payload }) => {
      const { user } = payload;
      state.isLoadingUser = false;
      state.user = user;
    },
    [getUserData.rejected]: (state) => {
      state.isLoadingUser = false;
    },
  },
});

export const { toggleSidebar, logoutUser } = userSlice.actions;

export default userSlice.reducer;
