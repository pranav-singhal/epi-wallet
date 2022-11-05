/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import classNames from "classnames";
import moment from "moment";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
const MESSAGETYPES = {
  SENT: 'sent',
  RECIEVED: 'recieved'

}

const BASE_URL = 'http://localhost:1337';

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
  const {
    crypto = "ETH",
  } = props;

  const [message, setMessage] = useState({...props});

  

  const handleApprove = (txHash = 'randomHash') => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    fetch(`${BASE_URL}/transaction/${props.transactionId}`, {method: 'PUT', headers: myHeaders, body: JSON.stringify({
        status: "pending",
        id: props.transactionId,
        hash: txHash
    })})
        .then(res => res.json())
        .then((res) => {
          setMessage({...message, ...res});
        })

  }

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
          {message.status === "unconfirmed" && message.type === MESSAGETYPES.RECIEVED && (
            <Button type="primary" shape="round" onClick={() => {handleApprove()}}>
              Approve
            </Button>
          )}
        </div>

        <div className="crypto-message-card__footer">
          <div className="crypto-message-card__footer-status">
            {message.status === "completed" ? (
              <CheckCircleOutlined />
            ) : (
              <ClockCircleOutlined />
            )}
            <span>{getMessageStatus(message.status)}  txID: {message.transactionId}</span>
          </div>
          <div className="crypto-message-card__footer-timestamp">
            {moment.unix(parseInt(message.createdAt)).fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTransferMessage;
