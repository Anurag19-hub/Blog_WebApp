import { configureStore,combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import themeReducer from './theme/themeSlice';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const rootReducer = combineReducers ({

  user: userReducer,
  theme: themeReducer,
});


const persistConfig = {

  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    //now all the setup of redux has been done now all we can use it in sign-in page.
    //user: userReducer,

    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware( { serializableCheck: false } ),
});


// Now it'll be exported to main.jsx
export const persistor = persistStore(store);