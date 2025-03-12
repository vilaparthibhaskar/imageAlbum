import { createSlice } from '@reduxjs/toolkit';

// ✅ Load initial state from localStorage
const loadUserState = () => {
  try {
    const serializedState = localStorage.getItem("userState");
    return serializedState ? JSON.parse(serializedState) : { 
      name: '', 
      loggedin: false, 
      email: '', 
      token: null, 
      userid: null, 
      albums: [],
    };
  } catch (err) {
    console.error("Failed to load user state", err);
    return { name: '', loggedin: false, email: '', token: null, userid: null, albums: [] };
  }
};

const initialState = loadUserState();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    change_name: (state, action) => {
      state.name = action.payload;
    },
    change_loggedin: (state, action) => {
      state.loggedin = action.payload;
    },
    change_email: (state, action) => {
      state.email = action.payload;
    },
    update_token: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload); // ✅ Save token separately
    },
    update_userid: (state, action) => {
      state.userid = action.payload;
    },
    change_albums: (state, action) => {
      state.albums = action.payload; // ✅ Fix: Correctly updating albums state
    },
    logout: () => {
      console.log("Logging out and clearing local storage..."); // ✅ Debugging line
      localStorage.removeItem("userState"); // ✅ Clear persisted state
      localStorage.removeItem("token"); // ✅ Clear token
      return { name: '', loggedin: false, email: '', token: null, userid: null, albums: [] };
    }
  }
});

// ✅ Save Redux state to localStorage on every state change
const saveUserState = (state) => {
  try {
    localStorage.setItem("userState", JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save user state", err);
  }
};

// ✅ Listen for state changes and save them
export const persistUserState = (store) => {
  store.subscribe(() => {
    saveUserState(store.getState().user);
  });
};

export const { change_albums, change_name, change_loggedin, change_email, logout, update_token, update_userid } = userSlice.actions;

export default userSlice.reducer;

