/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import {Button, InputNumber, Space, Spin} from "antd";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { BASE_URL, getCurrentUser, fetchMessages } from "../../api";
import CryptoTransferMessage from "../../components/CryptoTransferMessage";

const ChatPage = ({ threadUser, startTransaction }) => {
  const { name: threadUserName } = threadUser;
  const [newMessageAmount, setNewMessageAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const messagesElement = useRef(null);
  const [messagesArray, setMessageArray] = useState();

  useEffect(() => {
    fetchMessages(threadUserName)
      .then((res) => {
        setMessageArray(res.messages);
        setIsLoading(false);
      })
  }, []);

  const handleSend = () => {
    startTransaction({
      to: threadUser,
      amount: newMessageAmount
    })
  }

  const handleRequest = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    fetch(`${BASE_URL}/message`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        "type": "request",
        "sender": getCurrentUser(),
        "recipient": threadUserName,
        "txDetails": {
          "amount": newMessageAmount
        }
      }),
    })
    .then(response => response.json())
    .then(() => {
      setNewMessageAmount(0);
      return fetchMessages(threadUserName)
    })
    .then((res) => {
      setMessageArray(res.messages)
    })
    .catch(error => console.error(error));
  }

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (messagesElement) {
      const { current: ele } = messagesElement;
      ele.scroll({ top: ele.scrollHeight, behavior: "smooth" });

      messagesElement.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className='fullpage-loader'>
        <Space size="middle">
          <Spin size='large'/>
        </Space>
      </div>
    )
  }

  return (
    <div className="chat-page">
      <div className="chat-page-input">
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          placeholder="Amount"
          onChange={setNewMessageAmount}
          value={newMessageAmount}
        />
        <Button
          type="primary"
          onClick={handleRequest}
          disabled={!_.isNumber(newMessageAmount) || newMessageAmount <= 0}
        >
          Request
        </Button>
        <Button
          type="primary"
          onClick={() => {handleSend()}}
          disabled={!_.isNumber(newMessageAmount) || newMessageAmount <= 0}
        >
          Send
        </Button>
      </div>
      <div className="chat-page-messages" ref={messagesElement}>
        {_.map(_.orderBy(messagesArray, ['createdAt'], ['asc']), (message) => (
          <CryptoTransferMessage
            key={message.id}
            message={message}
            handleApprove={() => {
              startTransaction({
                to: threadUser,
                amount: _.parseInt(message.amount),
                transactionId: message.transactionId
              })
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
