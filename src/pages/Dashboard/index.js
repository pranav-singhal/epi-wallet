/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import React, { useEffect, useState } from "react";
import { Avatar, Button, Divider, Skeleton } from "antd";
import _ from "lodash";
import { ArrowDownOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { toTitleCase } from "../../helpers";
import useUserDetails from "../../hooks/useUserDetails";
import ChatList from "../../components/ChatList";
import EnableNotificationsPopup from "../../components/EnableNotificationsPopup";
import ChainSwitcher from "../../components/ChainSwitcher";
import useChainContext from "../../hooks/useChainContext";
import { useNavigate } from "react-router-dom";
import AddressBar from "../../components/AddressBar";
import ExternalLink from "../../icons/ExternalLinkIcon";
import { BLOCK_EXPLORER_BASE_URL } from "../../helpers/Web3";

const Dashboard = (props) => {
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const [accountBalance, setAccountBalance] = useState(0);
  const [web3, rpcUrl] = useChainContext();
  const navigate = useNavigate();

  const [userDetails] = useUserDetails(null);

  const updateAccountBalanceInEth = () => {
    web3.getAccountBalance(web3.getAccountAddress(), "eth").then((res) => {
      setAccountBalance(parseFloat(res));
    });
  };

  useEffect(() => {
    if (_.isEmpty(userDetails)) {
      return;
    }

    updateAccountBalanceInEth();

    const currentUser = localStorage.getItem("current_user");

    // if username does not exist in the list of users, remove the associated localstorage entry
    // and naviagate to new wallet page
    if (_.isEmpty(userDetails[currentUser])) {
      localStorage.removeItem("current_user");
      web3.clearAllWallets();

      navigate("/wallet/new");
    }

    setCurrentUserDetails(userDetails[currentUser]);
  }, [userDetails, rpcUrl]);

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
      <ChainSwitcher />
      <div className="wallet-info">
        <div
          className="wallet-info__external-link"
          onClick={() => {
            window.open(
              `${BLOCK_EXPLORER_BASE_URL}/address/${currentUserDetails.address}`
            );
          }}
        >
          <ExternalLink size={24} />
        </div>
        <div className="wallet-info__name">
          <Avatar size={64} src={currentUserDetails.avatar} />
          <div>{toTitleCase(currentUserDetails.name)}</div>
          <AddressBar currentUserDetails={currentUserDetails} />
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
          <div
            onClick={() => {
              props.initiateTransaction({ type: "request" });
            }}
          >
            <Button
              type="primary"
              icon={<ArrowDownOutlined />}
              shape="circle"
            />
            <div>Request</div>
          </div>
          <div onClick={() => props.initiateTransaction()}>
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
      <EnableNotificationsPopup />
    </>
  );
};

export default Dashboard;
