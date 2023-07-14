import {
    configureStore
} from "@reduxjs/toolkit";
import testReducer from "./Slices/testSlice";

export default configureStore({
    reducer: {
        data: testReducer,
    },
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());