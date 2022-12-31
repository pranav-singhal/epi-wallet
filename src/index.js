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
import {INFURA_API_KEY, Web3Helper} from "./helpers/Web3";

// [start]: initial state
export const ChainContext = createContext(chainList[1]);
let preferredRpcUrl = _.get(chainList[1], 'rpc[0]');
preferredRpcUrl = _.replace(preferredRpcUrl, 'INFURA_API_KEY', INFURA_API_KEY)
const web3 = new Web3Helper(preferredRpcUrl)
// [end]: initial state

const Store= ({children}) => {
    const [state, dispatch] = useReducer((state, action) => {
        if (action.type === 'switch_chain') {

            const newChain = _.filter(chainList, (chainItem) => {return chainItem.name === action.chain})

            if (!_.isEmpty(newChain)) {

                // when chain is switched, create a new web3 object with the rpc of the new chain
                // pass that object to the state
                // this way, the web3 object is only initialised when state is updated
                let preferredRpcUrl = _.get(newChain[0], 'rpc[0]');
                preferredRpcUrl = _.replace(preferredRpcUrl, 'INFURA_API_KEY', INFURA_API_KEY)
                const web3 = new Web3Helper(preferredRpcUrl)

                return {...newChain[0], web3}
            }
        }
        return chainList[1];

    }, {...chainList[1], web3});

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
