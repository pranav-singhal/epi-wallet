import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { getUserSubscription, subscribeToNotifications } from "../../api";
import "./style.scss";
import BottomOverlayLayout from "../Layouts/BottomOverlayLayout";
import _ from "lodash";
import useChainContext from "../../hooks/useChainContext";
import { Web3Helper } from "../../helpers/Web3";

const EnableNotificationsPopup = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [rpcUrl] = useChainContext();
    const web3 = new Web3Helper(rpcUrl)
    const signer = web3.getEthersWallet();
    const handleEnableNotificationsClick = () => {
        subscribeToNotifications(signer)
        .then(res => {
            console.log("server response of notification subscription: ", res);
            setShowPopup(false)
        })
        .catch(err => {
            console.log("somethihg went wrong: ", err)
        })
    }


  useEffect(() => {
    const currentUserUsername = localStorage.getItem("current_user");
    let subscriptionObjectStored = "";
    getUserSubscription(currentUserUsername)
      .then((_subscriptionObjectStored) => {
        subscriptionObjectStored = _subscriptionObjectStored;
        return navigator.serviceWorker.register("/service-worker.js");
      })
      .then((registration) => {
        return navigator.serviceWorker.ready;
      })
      .then((swRegistration) => {
        return swRegistration.pushManager.getSubscription();
      })
      .then((_subscriptionObjectBrowser) => {
        console.log(
          "browser value, stored value",
          JSON.stringify(_subscriptionObjectBrowser),
          subscriptionObjectStored?.userSubscription?.subscription
        );
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

// TODO - 1. get subscription for user
// 2. if user is not subscribed - show popup
// 3. on enable - save the notification to backend
// 4. store vapid keys on aws
// 5. push the server code to aws so that vapid keys are picked from aws
// 6. Implement password lock?
// 7. open the url of the chat page for which notification is received
