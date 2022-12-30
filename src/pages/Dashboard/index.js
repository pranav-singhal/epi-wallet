/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import React, { useEffect, useState } from "react";
import { Avatar, Badge, Button, Col, Divider, Row, Skeleton } from "antd";
import _ from "lodash";
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  DownOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { BASE_URL } from "../../api";
import Web3, { BLOCK_EXPLORER_BASE_URL } from "../../helpers/Web3";
import { toTitleCase } from "../../helpers";
import { useNavigate } from "react-router-dom";
import useUserDetails from "../../hooks/useUserDetails";
import { TransactionOverlayContainer } from "../../components/TransactionOverlay";
import ChatList from "../../components/ChatList";
import EnableNotificationsPopup from "../../components/EnableNotificationsPopup";

const Dashboard = (props) => {
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const [accountBalance, setAccountBalance] = useState(0);

  const [userDetails] = useUserDetails(null);
  const navigate = useNavigate();

  const goToNewRequestPage = () => {
    navigate("/request/new");
  };

  const goToNewSendMoneyPage = () => {
    navigate("/send/new");
  };

  const updateAccountBalanceInEth = () => {
    Web3.getAccountBalance(Web3.getAccountAddress(), "eth").then((res) => {
      setAccountBalance(parseFloat(res));
    });
  };

  useEffect(() => {
    if (_.isEmpty(userDetails)) {
      return;
    }

    updateAccountBalanceInEth();

    const currentUser = localStorage.getItem("current_user");
    setCurrentUserDetails(userDetails[currentUser]);
  }, [userDetails]);

  const getAddress = () => {
    if (_.isEmpty(currentUserDetails)) {
      return null;
    }

    const fullAddress = currentUserDetails.address,
      beginning = fullAddress.slice(0, 7),
      ending = fullAddress.slice(-6);

    return `${beginning}...${ending}`;
  };

  if (_.isEmpty(currentUserDetails)) {
    return (
      <div className="wallet-info-loading wallet-info">
        <Skeleton.Avatar active size={64} />
        <Skeleton active title />
      </div>
    );
  }

  return (
    <>
      <div className="chain-switcher">
        <span>Sepolia Test Network</span>
        <DownOutlined />
      </div>
      <div className="wallet-info">
        <div className="wallet-info__name">
          <Avatar size={64} src={currentUserDetails.avatar} />
          <div>{toTitleCase(currentUserDetails.name)}</div>
          <div
            className="wallet-info__name-address"
            onClick={() => {
              window.open(
                `${BLOCK_EXPLORER_BASE_URL}/address/${currentUserDetails.address}`
              );
            }}
          >
            <div>{_.toUpper(getAddress())}</div>
            <div>
              <LinkOutlined />
            </div>
          </div>
        </div>
        <div className="wallet-info__balance">
          <img
            className="no-background"
            src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023"
            alt=""
            style={{ width: 28 }}
          />
          <div>{accountBalance.toFixed(5)}</div>
        </div>
        <div className="wallet-info__actions">
          <div onClick={goToNewRequestPage}>
            <Button
              type="primary"
              icon={<ArrowDownOutlined />}
              shape="circle"
            />
            <div>Request</div>
          </div>
          <div onClick={goToNewSendMoneyPage}>
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              shape="circle"
            />
            <div>Send</div>
          </div>
        </div>
      </div>
      <Divider dashed className="wallet-info__divider" orientation="left" plain>
        Transactions
      </Divider>
      <ChatList {...props} />
      {/* <EnableNotificationsPopup /> */}
    </>
  );
};

export default Dashboard;
