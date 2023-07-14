import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { BrowserRouter, MemoryRouter } from 'react-router-dom';

//REDUX 
import { Provider } from "react-redux";
import store from "./store.js";

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <MemoryRouter >
            <App />
        </MemoryRouter >
    </Provider>
)
