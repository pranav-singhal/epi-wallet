import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CreateWallet from "./pages/CreateWallet";
import ImportWalletPage from "./pages/ImportWallet";
import SetupWallet from "./pages/SetupWallet";
import NewRequestPage from "./components/NewRequestPage";
import QRCodeScanner from "./pages/QRCodeScanner";
import ChatPage from "./pages/ChatPage";
import TransactionPopup from "./pages/TransactionPopup";
import NewSendMoneyPage from './components/NewSendMoneyPage';
import {subscribeToWebNotifications} from "./helpers";

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
            path: "/request/new",
            element: <NewRequestPage />
        },
        {
            path: "/send/new",
            element: <NewSendMoneyPage />
        },
        {
            path: "/scan",
            element: <QRCodeScanner />
        },
        {
            path: "/chat",
            element: <ChatPage />
        },
        {
            path: "/transaction",
            element: <TransactionPopup />
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
