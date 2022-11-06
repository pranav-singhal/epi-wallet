/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import classNames from "classnames";
import moment from "moment";
import {CheckCircleOutlined, ClockCircleOutlined, LinkOutlined} from "@ant-design/icons";
import { Button } from "antd";
import _ from 'lodash';
import React, {useEffect, useState} from "react";
import Web3, {BLOCK_EXPLORER_BASE_URL} from "../../helpers/Web3";
import {BASE_URL} from "../../api";
const MESSAGETYPES = {
  SENT: 'sent',
  RECIEVED: 'recieved'

}

const getMessageStatus = (currentStatus) => {
  switch (currentStatus) {
    case "pending":
      return "In Progress";
    case "unconfirmed":
      return "Pending Approval";
    case "completed":
    default:
      return "Done";
  }
};

const currentUser = localStorage.getItem('current_user');


const CryptoTransferMessage = (props) => {
  const { crypto = "ETH", message } = props;
  const [messageStatus, setMessageStatus] = useState(message.status)
  const showExplorerLink = !_.isEmpty(message.hash);

  useEffect(() => {
    if (message.status !== 'pending' || _.isEmpty(message.hash)) {
      return;
    }

    const interval = setInterval(() => {
      Web3.checkIfMined(message.hash)
        .then((isMined) => {
          if (!isMined) {
            return;
          }

          clearInterval(interval);

          setMessageStatus('completed');

          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          return fetch(`${BASE_URL}/transaction/${message.transactionId}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify({
              status: "completed",
              id: message.transactionId,
            })
          })
        })
        .catch((err) => {
          console.error(err);
          clearInterval(interval);
        })
    }, 3000)
  })

  return (
    <div className="crypto-message">
      <div
        className={classNames("crypto-message-card", {
          "float-right": message.type === MESSAGETYPES.SENT,
        })}
      >
        <div className="crypto-message-card__type">
          {message.from === currentUser ? "From you" : "To you"}
        </div>
        <div className="crypto-message-card__amount">
          {message.amount} {crypto}
          {messageStatus === "unconfirmed" && message.type === MESSAGETYPES.RECIEVED && (
            <Button type="primary" shape="round" onClick={() => props.handleApprove()}>
              Approve
            </Button>
          )}
        </div>

        <div className="crypto-message-card__footer">
          <div
            className="crypto-message-card__footer-status"
            onClick={() => {
              if (!showExplorerLink) {
                return;
              }

              window.open(`${BLOCK_EXPLORER_BASE_URL}/tx/${message.hash}`)
            }}
          >
            {messageStatus === "completed" ? (
              <CheckCircleOutlined />
            ) : (
              <ClockCircleOutlined />
            )}
            <span>{getMessageStatus(messageStatus)}</span>
            {
              showExplorerLink &&
                <div>
                  <LinkOutlined />
                </div>
            }
          </div>
          <div className="crypto-message-card__footer-timestamp">
            {moment(parseInt(message.createdAt)).fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTransferMessage;
