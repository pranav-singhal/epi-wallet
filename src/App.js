import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.css";
import Dashboard from "./pages/Dashboard";
import { message } from "antd";
import { getNotifications, toTitleCase } from "./helpers";
import _ from "lodash";
import useUserDetails from "./hooks/useUserDetails";
import MainLayout from "./components/Layouts/MainLayout";
import useChainContext from "./hooks/useChainContext";
import TransactionConfirmationOverlay from "./components/TransactionOverlay";
import useTransaction from "./hooks/useTransaction";

export const PAGES = {
  DASHBOARD: "dashboard",
  CHAT_PAGE: "chat_page",
  QR_CODE_SCANNER: "qr_code_scanner",
  TRANSACTION_POPUP: "transaction_popup",
  IMPORT_WALLET: "import_wallet",
};

function App() {
  const [userDetails] = useUserDetails();
  const [web3] = useChainContext();
  const isWalletLoaded = web3?.isAccountLoaded();
  const [
    shouldShowTransactionPopover,
    transactionDetails,
    initiateTransaction,
    endTransaction,
  ] = useTransaction();
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('current_user');
    if (!username) {
      console.log("no username found!!!: ", username);
    }
    if (window.webkit) {
      console.log("webkit: found")
      window.webkit.messageHandlers.observer.postMessage(`username:${username}`);

    } else {
      console.log("webkit: not found")
    }
    if (!web3?.isAccountLoaded()) {
      return navigate("/wallet/new");
    }
  }, []);

  useEffect(() => {
    if (_.isEmpty(userDetails)) {
      return;
    }

    let isNextCallAllowed = true;

    const tick = () => {
      isNextCallAllowed = false;

      getNotifications(web3.getAccountAddress())
        .then((_res) => {
          if (Array.isArray(_res) && _res.length > 0) {
            _.slice(_res, 0, 2).map((_notificationObject) => {
              const notificationObject = JSON.parse(
                _notificationObject.message
              );

              if (notificationObject.type === "request") {
                const dismissMessage = message.warning({
                  content: (
                    <span>
                      <b>{toTitleCase(notificationObject.from)}</b> has
                      requested <b>{notificationObject.amount}</b>{" "}
                      <img
                        className="no-background"
                        src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023"
                        alt=""
                        style={{
                          width: "18px",
                          marginBottom: "3px",
                        }}
                      />
                    </span>
                  ),
                  duration: 6,
                  className: "message-notification",
                  onClick: () => {
                    navigate(`/chat?to=${notificationObject.from}`)
                    dismissMessage();
                    // initiateTransaction({
                    //   to: notificationObject.from,
                    //   value: notificationObject.amount,
                    // });
                  },
                });
              } else {
                const dismissMessage = message.success({
                  content: (
                    <span>
                      <b>{toTitleCase(notificationObject.from)}</b> has sent{" "}
                      <b>{notificationObject.amount}</b>{" "}
                      <img
                        className="no-background"
                        src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023"
                        alt=""
                        style={{
                          width: "18px",
                          marginBottom: "3px",
                        }}
                      />
                    </span>
                  ),
                  className: "message-notification",
                  onClick: () => {
                    navigate(`/chat?to=${notificationObject.from}`)
                    dismissMessage()
                  }
                });
              }
            });
          }

          isNextCallAllowed = true;
        })
        .catch((err) => {
          console.error(err);

          clearInterval(window.notificationPoll);
        });
    };
    if (isWalletLoaded) {
      if (!window.notificationPoll) {
        window.notificationPoll = setInterval(() => {
          if (isNextCallAllowed) {
            tick();
          }
        }, 5000);
      }
    }
  }, [userDetails]);

  return (
    <MainLayout>
      <Dashboard initiateTransaction={initiateTransaction} />
      {shouldShowTransactionPopover && (
        <TransactionConfirmationOverlay
          shouldNavigateToReceiver
          {...transactionDetails}
          onApprove={endTransaction}
          onDecline={endTransaction}
          onCancel={endTransaction}
        />
      )}
    </MainLayout>
  );
}

export default App;
