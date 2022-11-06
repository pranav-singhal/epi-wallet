/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import React, { useEffect, useState } from "react";
import {Avatar, Badge, Button, Col, Divider, Row, Space} from "antd";
import _ from "lodash";
import {
  ArrowDownOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { BASE_URL } from "../../api";
import Web3 from "../../helpers/Web3";
import {toTitleCase} from "../../helpers";

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

  useEffect(() => {
    // TODO - add new message count - not sure about how to do it
    fetch(`${BASE_URL}/threads?sender=${localStorage.getItem('current_user')}`, {
      headers: {
        'Content-Type': 'application/json'
      }

    })
      .then(res => res.json())
      .then(res => {
        setThreadUsers(res?.threads || []);
      });
  }, [])

  return (
    <div className="chat-list">
      <Row>
        {_.map(threadUsers, (threadUserName) => {
          const threadUser = _.get(props, ['userDetails', threadUserName]);
          console.log('ITLY', threadUser);
          return (
              <Col span={24} key={threadUser.address}>
                <AttachBadge showBadge={threadUser.user_type === 'vendor'}>
                <div
                  className="chat-list-row"
                  onClick={() => {
                    props.openChat(threadUser);
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

const Dashboard = (props) => {
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const [accountBalance, setAccountBalance] = useState(0);

  const updateAccountBalanceInEth = () => {
    Web3.getAccountBalance(Web3.getAccountAddress(), 'eth')
      .then(res => {
        setAccountBalance(parseFloat(res));
      })
  }

  useEffect(() => {
    updateAccountBalanceInEth();

    const currentUser = localStorage.getItem('current_user');
    setCurrentUserDetails(props.userDetails[currentUser]);
  }, []);

  const getAddress = () => {
    if (_.isEmpty(currentUserDetails)) {
      return null;
    }

    const fullAddress = currentUserDetails.address,
      beginning = fullAddress.slice(0, 7),
      ending = fullAddress.slice(-6)

    return `${beginning}...${ending}`
  }

  return (
    <>
      <div className='wallet-info'>
        <div className='wallet-info__name'>
          <Avatar size={64} src={currentUserDetails.avatar} />
          <div>
            {toTitleCase(currentUserDetails.name)}
          </div>
          <div>
            {_.toUpper(getAddress())}
          </div>
        </div>
        <div className='wallet-info__balance'>
          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023" alt="" style={{width: 28}}/>
          <div>
            {accountBalance.toFixed(5)}
          </div>
        </div>
        <div className='wallet-info__actions'>
          <div>
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
