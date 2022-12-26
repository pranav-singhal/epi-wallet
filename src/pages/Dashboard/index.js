/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import React, { useEffect, useState } from "react";
import {Avatar, Badge, Button, Col, Divider, Row, Skeleton} from "antd";
import _ from "lodash";
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  DownOutlined,
  LinkOutlined
} from "@ant-design/icons";
import {BASE_URL, getAllUsers} from "../../api";
import Web3, {BLOCK_EXPLORER_BASE_URL} from "../../helpers/Web3";
import {toTitleCase} from "../../helpers";
import {useNavigate} from "react-router-dom";
import useUserDetails from "../../hooks/useUserDetails";

const AttachBadge = (props) => {
  if (!props.showBadge) {
    return props.children;
  }

  return (
    <Badge.Ribbon text="Business" color="blue">
      {props.children}
    </Badge.Ribbon>
  )
}

const ChatList = (props) => {
  const [threadUsers, setThreadUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [userDetails] = useUserDetails();

  useEffect(() => {
    // TODO - add new message count - not sure about how to do it
    const fetchPromise = fetch(`${BASE_URL}/threads?sender=${localStorage.getItem('current_user')}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        setThreadUsers(_.compact(res?.threads) || []);
      });

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve(), 1500);
    });

    Promise.all([fetchPromise, timeoutPromise])
      .then(() => {
        setIsLoading(false);
      })
  }, [])

  if (isLoading) {
    return (
      <div className="chat-list-loading">
        <Skeleton active avatar paragraph={{ rows: 1 }} />
        <Skeleton active avatar paragraph={{ rows: 1 }} />;
      </div>
    )
  }

  if (userDetails) {
    return (
        <div className="chat-list">
          <Row>
            {_.map(threadUsers, (threadUserName) => {
              const threadUser = _.get(userDetails, [threadUserName]);
              return (
                  <Col span={24} key={threadUser.address}>
                    <AttachBadge showBadge={threadUser.user_type === 'vendor'}>
                      <div
                          className="chat-list-row"
                          onClick={() => {
                            navigate(`/chat?to=${threadUser.username}`)
                          }}
                      >
                        <Avatar src={threadUser.avatar} />
                        <div className="chat-list-row__content">
                          <div className="chat-list-row__content-name">
                            {toTitleCase(threadUser.name)}
                          </div>
                          <div className="chat-list-row__content-address">
                            {threadUser.address}
                          </div>
                        </div>
                        <div className="chat-list-row__icon">
                          <ArrowRightOutlined />
                        </div>
                      </div>
                    </AttachBadge>
                  </Col>
              )
            })}
          </Row>
        </div>
    );
  }

}

const Dashboard = (props) => {
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const [accountBalance, setAccountBalance] = useState(0);

  const [userDetails] = useUserDetails(null);
  const navigate = useNavigate();

  const goToNewRequestPage = () => {
    navigate('/request/new')
  }

  const updateAccountBalanceInEth = () => {
    Web3.getAccountBalance(Web3.getAccountAddress(), 'eth')
      .then(res => {
        setAccountBalance(parseFloat(res));
      })
  }

  useEffect(() => {
    if (_.isEmpty(userDetails)) {
      return;
    }

    updateAccountBalanceInEth();

    const currentUser = localStorage.getItem('current_user');
    setCurrentUserDetails(userDetails[currentUser]);
  }, [userDetails]);

  const getAddress = () => {
    if (_.isEmpty(currentUserDetails)) {
      return null;
    }

    const fullAddress = currentUserDetails.address,
      beginning = fullAddress.slice(0, 7),
      ending = fullAddress.slice(-6)

    return `${beginning}...${ending}`
  }

  if (_.isEmpty(currentUserDetails)) {
    return (
      <div className='wallet-info-loading wallet-info'>
        <Skeleton.Avatar active size={64} />
        <Skeleton active title />
      </div>
    )
  }

  return (
    <>
      <div className='chain-switcher'>
        <span>Sepolia Test Network</span>
        <DownOutlined />
      </div>
      <div className='wallet-info'>
        <div className='wallet-info__name'>
          <Avatar size={64} src={currentUserDetails.avatar} />
          <div>
            {toTitleCase(currentUserDetails.name)}
          </div>
          <div
            className='wallet-info__name-address'
            onClick={() => {
              window.open(`${BLOCK_EXPLORER_BASE_URL}/address/${currentUserDetails.address}`)
            }}
          >
            <div>
              {_.toUpper(getAddress())}
            </div>
            <div>
              <LinkOutlined />
            </div>
          </div>
        </div>
        <div className='wallet-info__balance'>
          <img className='no-background' src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023" alt="" style={{width: 28}}/>
          <div>
            {accountBalance.toFixed(5)}
          </div>
        </div>
        <div className='wallet-info__actions'>
          <div onClick={goToNewRequestPage}>
            <Button type="primary" icon={<ArrowDownOutlined />} shape='circle' />
            <div>
              Request
            </div>
          </div>
          <div>
            <Button type="primary" icon={<ArrowRightOutlined />} shape='circle' />
            <div>
              Send
            </div>
          </div>
        </div>
      </div>
      <Divider
        dashed
        className='wallet-info__divider'
        orientation='left'
        plain
      >
        Transactions
      </Divider>
      <ChatList {...props} />
    </>
  )
};

export default Dashboard;
