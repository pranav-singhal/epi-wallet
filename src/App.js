import { useEffect, useState } from "react";
import "./App.scss";
import "antd/dist/antd.css";
import { api } from "@epnsproject/frontend-sdk-staging";
import ChatList from "./pages/ChatList";
import { PageHeader } from "antd";
import ChatPage from "./pages/ChatPage";

const PAGES = {
  DASHBOARD: "dashboard",
  CHAT_PAGE: "chat_page",
};

const PROJECT_NAME = "Project X";

function App() {
  const [openPage, setOpenPage] = useState(PAGES.DASHBOARD);

  const [selectedChat, setSelectedChat] = useState({
    name: "Bob",
    address: "0xbf8C34F0f19e7a0fBa497372BFEca821C145B24D",
    avatarLink: "https://www.w3schools.com/howto/img_avatar.png",
    numNewMessages: 1,
  });

  const showBackButton = openPage !== PAGES.DASHBOARD;

  useEffect(() => {
    const walletAddress = "0x124f7f89889648437C9cDa73565862f398930e62";
    const pageNumber = 1;
    const itemsPerPage = 5;
    api
      .fetchNotifications(walletAddress, itemsPerPage, pageNumber)
      .then(console.log);
  });

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
        return <ChatPage />;

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
      <div className="site-page-content">{getPage()}</div>
    </div>
  );
}

export default App;
