import React, { createContext, useReducer } from 'react';
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
import NewSendMoneyPage from './components/NewSendMoneyPage';
import chainList from "./helpers/chains.json";
import _ from 'lodash';

export const ChainContext = createContext(chainList[1]);
const Store= ({children}) => {
    const [state, dispatch] = useReducer((state, action) => {
        console.log("action called:", action)
        if (action.type === 'switch_chain') {

            const newChain = _.filter(chainList, (chainItem) => {return chainItem.name === action.chain})
            console.log("new chain:", newChain)
            if (!_.isEmpty(newChain)) {
                return {...newChain[0]}
            }
        }
        return chainList[1];

    }, chainList[1]);

    return (
        <ChainContext.Provider value={[state, dispatch]}>
                {children}
        </ChainContext.Provider>
    )



};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/wallet/new",
    element: <SetupWallet />,
  },
  {
    path: "/wallet/create",
    element: <CreateWallet />,
  },
  {
    path: "/wallet/import",
    element: <ImportWalletPage />,
  },
  {
    path: "/request/new",
    element: <NewRequestPage />,
  },
  {
    path: "/send/new",
    element: <NewSendMoneyPage />,
  },
  {
    path: "/scan",
    element: <QRCodeScanner />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Store>
    <RouterProvider router={router} />
  </Store>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
