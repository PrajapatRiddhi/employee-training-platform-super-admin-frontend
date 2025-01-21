import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // or your preferred storage engine
import userReducer from './user';
import thunk from 'redux-thunk';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userReducer'], // add the reducers that you want to persist
};
// const combineReducer = {
//     permissionReducer, userReducer
// }
const rootReducer = combineReducers({
    userReducer: userReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    //@ts-ignore
    middleware: [thunk],
});

const persistor = persistStore(store);

export { store, persistor };
