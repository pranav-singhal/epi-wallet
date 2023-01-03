import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { getUserSubscription, subscribeToNotifications } from "../../api";
import "./style.scss";
import BottomOverlayLayout from "../Layouts/BottomOverlayLayout";
import useChainContext from "../../hooks/useChainContext";
import { isSafariIos, isWebView } from "../../helpers";

const EnableNotificationsPopup = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [web3] = useChainContext();
    const signer = web3?.getEthersWallet();
    const handleEnableNotificationsClick = () => {
        subscribeToNotifications(signer)
        .then(() => {
            setShowPopup(false)
        })
        .catch(err => {
            console.log("somethihg went wrong: ", err)
        })
    }

  useEffect(() => {
    const currentUserUsername = localStorage.getItem("current_user");
    let subscriptionObjectStored = "";

    if (!isWebView() && !isSafariIos()) {

      getUserSubscription(currentUserUsername)
      .then((_subscriptionObjectStored) => {
        subscriptionObjectStored = _subscriptionObjectStored;
        return navigator.serviceWorker.register("/service-worker.js");
      })
      .then(() => {
        return navigator.serviceWorker.ready;
      })
      .then((swRegistration) => {
        return swRegistration.pushManager.getSubscription();
      })
      .then((_subscriptionObjectBrowser) => {
        if (
          JSON.stringify(_subscriptionObjectBrowser) !==
          subscriptionObjectStored?.userSubscription?.subscription
        ) {
          // enable notifications popup
          setShowPopup(true);
        } else {
          console.log("user subscribed to notifications!!!");
        }
      });
    }
  }, []);

  if (!showPopup) {
    return null;
  }
  return (
    <BottomOverlayLayout className="notification-recommendation">
      <div className="notification-recommendation-heading">
        <h3>Enable Notifications</h3>
        <Button
          shape="circle"
          type="default"
          icon={<CloseOutlined />}
          size="small"
          onClick={() => setShowPopup(false)}
        />
      </div>
      <div className="notification-recommendation-content">
        So that you never miss a message from your friends when they send you
        coins
      </div>
      <div className="notification-recommendation-footer">
        <Button
          type="primary"
          onClick={handleEnableNotificationsClick}
        >
          Enable Notifications
        </Button>
      </div>
    </BottomOverlayLayout>
  );
};

export default EnableNotificationsPopup;

// TODO:
// 1. fix browser notifications
// 2. handle decline state
// 6. Implement password lock?
