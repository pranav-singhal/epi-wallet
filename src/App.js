import React, { useState, useEffect } from "react";
import "./App.scss";
import "antd/dist/antd.css";
import Dashboard from "./pages/Dashboard";
import {Button, PageHeader, notification, Spin, Space, Typography, Avatar} from "antd";
import { QrcodeOutlined } from '@ant-design/icons'
import ChatPage from "./pages/ChatPage";
import QRCodeScanner from "./pages/QRCodeScanner";
import TransactionPopup from "./pages/TransactionPopup";
import OptInNotificationsButton from "./components/OptInNotificationsButton";
import { getNotifications, toTitleCase } from "./helpers";
import {getAllUsers} from "./api";
import Web3 from "./helpers/Web3";
import ImportWallet from "./components/ImportWallet";
import ImportWalletPage from "./components/ImportWalletPage";
import _ from "lodash";

const PAGES = {
  DASHBOARD: "dashboard",
  CHAT_PAGE: "chat_page",
  QR_CODE_SCANNER: "qr_code_scanner",
  TRANSACTION_POPUP: 'transaction_popup',
  IMPORT_WALLET: 'import_wallet'
};

const PROJECT_NAME = "EPI";
const { Text } = Typography;

function App() {
  const [openPage, setOpenPage] = useState(PAGES.DASHBOARD);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const isWalletLoaded = Web3.isAccountLoaded();

  useEffect(() => {
      getAllUsers()
          .then(res => {
              setUserDetails(res?.users);
          })
          .finally(() => {
              setIsUsersLoading(false);
          })

  }, []);


   useEffect(() => {
     if (_.isEmpty(userDetails)) {
       return;
     }

     const tick = () => {
       getNotifications(Web3.getAccountAddress())
         .then(_res => {
           if (Array.isArray(_res) && _res.length > 0 ) {
             _.slice(_res, 0,2).map(_notificationObject => {
               const message = JSON.parse(_notificationObject.message);

               notification.open({
                 message: _notificationObject.notification.title,
                 description: (
                   <div>
                     from : {message.from}
                     <br />
                     amount: {message.amount}
                     <br />
                     createdAt: {message.createdAt}
                   </div>
                 ),
                 onClick: () => {
                   setSelectedChat(userDetails[message.from])
                   setOpenPage(PAGES.CHAT_PAGE);
                 }
               })
             })
           }
         })
         .catch((err) => {
           console.error(err);

           clearInterval(window.notificationPoll);
         })
     }
     if (isWalletLoaded) {
       if (!window.notificationPoll) {
           window.notificationPoll = setInterval(() => {
               tick();

           }, 5000)
       }
     }
   }, [userDetails])

  const [selectedChat, setSelectedChat] = useState({});
  const [transaction, setTransaction] = useState({});
  const showBackButton = openPage !== PAGES.DASHBOARD;


  const getPageTitle = () => {
    switch (openPage) {
      case PAGES.CHAT_PAGE:
        return toTitleCase(selectedChat?.name);

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
          userDetails={userDetails}
          threadUser={selectedChat}
          startTransaction={(transaction) => {
            setTransaction(transaction);
            setOpenPage(PAGES.TRANSACTION_POPUP)
          }}
        />;

        case PAGES.IMPORT_WALLET:
            return <ImportWalletPage userDetails={userDetails} />;

      case PAGES.QR_CODE_SCANNER:
        return (
          <QRCodeScanner
            userDetails={userDetails}
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
            userDetails={userDetails}
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
          <Dashboard
            userDetails={userDetails}
            openChat={(selectedChat) => {
              setSelectedChat(selectedChat);
              setOpenPage(PAGES.CHAT_PAGE);
            }}
          />
        );
    }
  };

  const shouldShowQRCode = () => {
    return openPage === PAGES.DASHBOARD;
  }

  if (isUsersLoading) {
    return (
      <div className='root-loader'>
        <Space size="middle">
          <Spin size='large'/>
        </Space>
      </div>
    );
  }

  return (
    <div className="app">
      <PageHeader
        className="site-page-header"
        avatar={openPage === PAGES.DASHBOARD ?
          {
            src: 'https://i.imgur.com/ZAE8cku.png'
          } :
          null
        }
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
          />,
          !Web3.isAccountLoaded() &&
            <ImportWallet
              setOpenPage={() => {
                setOpenPage(PAGES.IMPORT_WALLET)
              }}
            />,
          <OptInNotificationsButton />
        ] : []}
      />

      <div className="site-page-content">{getPage()}</div>
    </div>
  );
}

export default App;
