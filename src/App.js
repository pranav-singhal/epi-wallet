import { useEffect, useState } from "react";
import "./App.scss";
import "antd/dist/antd.css";
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import ChatList from "./pages/ChatList";
import { Button, PageHeader, notification } from "antd";
import ChatPage from "./pages/ChatPage";
import OptInNotificationsButton from "./components/OptInNotificationsButton";
import { getNotifications, sendNotification } from "./helpers";
import { userDetails } from "./api";

const NOTIFICATION_CONSUMER_1_PVT_KET = localStorage.getItem('pvt_key');
const signer = new ethers.Wallet(NOTIFICATION_CONSUMER_1_PVT_KET);
const public_key = signer?.address;
console.log('pvt key:', localStorage.getItem('pvt_key'), public_key);

const PAGES = {
  DASHBOARD: "dashboard",
  CHAT_PAGE: "chat_page",
};

const PROJECT_NAME = "Project X";

function App() {
  const [openPage, setOpenPage] = useState(PAGES.DASHBOARD);
  // const [notificationApi, contextHolder] = notification.useNotification();

  const sendTestNotification = () => {
    sendNotification('requset', {amount: 123, recipient: '0xD7F1a592874bbe5d14c3f024c08b630e6De5A11B', from: public_key})
    .then(console.log)
  }

  useEffect(() => {

    if (!window.notificationPoll) {
      window.notificationPoll = setInterval(() => {
  
        getNotifications(public_key)
        .then(_res => {

          console.log('testing', _res);
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
          clearInterval(window.notificationPoll);
        })
  
      }, 5000)
    }
    
  }, [])

  

  const [selectedChat, setSelectedChat] = useState({
    name: "Bob",
    address: "0xbf8C34F0f19e7a0fBa497372BFEca821C145B24D",
    avatarLink: "https://www.w3schools.com/howto/img_avatar.png",
    numNewMessages: 1,
  });

  const showBackButton = openPage !== PAGES.DASHBOARD;


  const getPageTitle = () => {
    switch (openPage) {
      case PAGES.CHAT_PAGE:
        return selectedChat.name;

      default:
      case PAGES.DASHBOARD:
        return PROJECT_NAME;
    }
  };

  const getPageSubtitle = () => {
    switch (openPage) {
      case PAGES.CHAT_PAGE:
        return PROJECT_NAME;

      default:
      case PAGES.DASHBOARD:
        return null;
    }
  };

  const getPage = () => {
    switch (openPage) {
      case PAGES.CHAT_PAGE:
        return <ChatPage threadUser={selectedChat.name} />;

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

  return (
    <div className="app">
      <PageHeader
        className="site-page-header"
        onBack={showBackButton ? () => setOpenPage(PAGES.DASHBOARD) : null}
        title={getPageTitle()}
        subTitle={getPageSubtitle()}
      />
      <Button onClick={sendTestNotification}>
        send test notification
      </Button>
      <OptInNotificationsButton />
      <div className="site-page-content">{getPage()}</div>
    </div>
  );
}

export default App;
