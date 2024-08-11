import { createSlice } from '@reduxjs/toolkit';

const initialState = {

// for example the user is null at the beginning then loading is false and message is null as well 
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({

//then we are going to have a name for that we have used 'user' and then we have passed initial stateand then we have created the logics or functions that here they call it as a reducers
    name: 'user',
    initialState,
    reducers: {

        signInStart: (state) => {

            state.loading = true;
            state.error = null;
        },

        signInSuccess: (state, action) => {
//In inspect we have network option where all the details of the user logins have been shown there is we have request payload so we are accessing it by this state.currentUser = action.payload; which means whoever the current user(jene atyre login karyu che) their details has their in payload and we are getting it.
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },

        signInFailure: (state, action) => {

            state.loading = false;
            state.error = action.payload;
        },

        updateStart: (state) => {

            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {

            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure:(state, action) => {

            state.loading = false;
            state.error = action.payload;
        },

        deleteUserStart:(state) => {

            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess:(state) => {

            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure:(state, action) => {

            state.loading = false;
            state.error = action.payload;
        },

        signoutSuccess: (state) => {

            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },


    },
});


// To use this functions or logics or they called reducers we have to export them so that we can use them to other places so we're going to export signing start, success and failure 

export const { 
        signInStart, 
        signInSuccess, 
        signInFailure, 
        updateStart, 
        updateSuccess, 
        updateFailure,
        deleteUserStart,
        deleteUserSuccess,
        deleteUserFailure,
        signoutSuccess,
    }
     = userSlice.actions;

export default userSlice.reducer;
//Now we can use this function in store.js file after importing it.