import { useState, useEffect } from "react";
import "./App.scss";
import "antd/dist/antd.css";
import ChatList from "./pages/ChatList";
import { Button, PageHeader, notification } from "antd";
import { QrcodeOutlined } from '@ant-design/icons'
import ChatPage from "./pages/ChatPage";
import QRCodeScanner from "./pages/QRCodeScanner";
import TransactionPopup from "./pages/TransactionPopup";
import OptInNotificationsButton from "./components/OptInNotificationsButton";
import { getNotifications } from "./helpers";
import { userDetails } from "./api";
import Web3 from "./helpers/Web3";

const PAGES = {
  DASHBOARD: "dashboard",
  CHAT_PAGE: "chat_page",
  QR_CODE_SCANNER: "qr_code_scanner",
  TRANSACTION_POPUP: 'transaction_popup'
};

const PROJECT_NAME = "Project X";

function App() {
  const [openPage, setOpenPage] = useState(PAGES.DASHBOARD);

  useEffect(() => {
    if (!window.notificationPoll) {
      window.notificationPoll = setInterval(() => {

        getNotifications(Web3.getAccountAddress())
          .then(_res => {
            if (Array.isArray(_res) && _res.length > 0 ) {
              _res.map(_notificationObject => {
                const message = JSON.parse(_notificationObject.message);
                // logic to re-fetch messages
                notification.open({
                  message: _notificationObject.notification.title,
                  description: (<div>
                    from : {message.from}
                    <br />
                    amount: {message.amount}
                    <br />
                    createdAt: {message.createdAt}
                  </div>),
                  onClick: () => {
                    setOpenPage(PAGES.CHAT_PAGE);
                    setSelectedChat(userDetails[message.from])
                  }
                })
              })
            }

          })
        .catch((err) => {
          console.error(err);

          clearInterval(window.notificationPoll);
        })
      }, 5000)
    }
  }, [])

  const [selectedChat, setSelectedChat] = useState({});
  const [transaction, setTransaction] = useState({});

  const showBackButton = openPage !== PAGES.DASHBOARD;


  const getPageTitle = () => {
    switch (openPage) {
      case PAGES.CHAT_PAGE:
        return selectedChat?.name;

      case PAGES.QR_CODE_SCANNER:
        return 'Scan to Pay';

      case PAGES.TRANSACTION_POPUP:
        return 'Confirm Transaction';

      default:
      case PAGES.DASHBOARD:
        return PROJECT_NAME;
    }
  };

  const getPageSubtitle = () => {
    switch (openPage) {
      case PAGES.CHAT_PAGE:
        return PROJECT_NAME;

      case PAGES.QR_CODE_SCANNER:
        return PROJECT_NAME;

      default:
      case PAGES.DASHBOARD:
        return null;
    }
  };

  const getPage = () => {
    switch (openPage) {
      case PAGES.CHAT_PAGE:
        return <ChatPage
          threadUser={selectedChat}
          startTransaction={(transaction) => {
            setTransaction(transaction);
            setOpenPage(PAGES.TRANSACTION_POPUP)
          }}
        />;

      case PAGES.QR_CODE_SCANNER:
        return (
          <QRCodeScanner
            onScanned={(scannedText) => {
              const qrBody = JSON.parse(scannedText),
                transactionDetail = {
                  to: userDetails[qrBody.vendorName],
                  amount: qrBody.amount,
                  qrId: qrBody.QRId
                };

              setTransaction(transactionDetail);
              setOpenPage(PAGES.TRANSACTION_POPUP);
            }}
          />
        );

      case PAGES.TRANSACTION_POPUP:
        return (
          <TransactionPopup
            onReject={() => setOpenPage(PAGES.DASHBOARD)}
            transaction={transaction}
            onDone={() => {
              setSelectedChat(transaction.to)
              setOpenPage(PAGES.CHAT_PAGE)
            }}
          />
        )

      default:
      case PAGES.DASHBOARD:
        return (
          <ChatList
            openChat={(selectedChat) => {
              setSelectedChat(selectedChat);
              setOpenPage(PAGES.CHAT_PAGE);
            }}
          />
        );
    }
  };

  const shouldShowQRCode = () => {
    return openPage !== PAGES.TRANSACTION_POPUP;
  }

  return (
    <div className="app">
      <PageHeader
        className="site-page-header"
        onBack={showBackButton ? () => setOpenPage(PAGES.DASHBOARD) : null}
        title={getPageTitle()}
        subTitle={getPageSubtitle()}
        extra={shouldShowQRCode() ? [
          <Button
            type="dashed"
            shape="circle"
            icon={<QrcodeOutlined />}
            size='large'
            onClick={() => setOpenPage(PAGES.QR_CODE_SCANNER)}
          />
        ] : []}
      />
      <OptInNotificationsButton />
      <div className="site-page-content">{getPage()}</div>
    </div>
  );
}

export default App;
