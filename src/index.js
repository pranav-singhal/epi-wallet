import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CreateWallet from "./components/CreateWallet";
import Dashboard from "./pages/Dashboard";
import ImportWalletPage from "./pages/ImportWallet";
import SetupWallet from "./components/SetupWallet";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />
        },
        {
            path: "/wallet/new",
            element: <SetupWallet />
        },
        {
            path: "/wallet/create",
            element: <CreateWallet />
        },
        {
            path: "/wallet/import",
            element: <ImportWalletPage />
        },
        {
            path: "/dashboard",
            element: <Dashboard />
        }
    ]
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
