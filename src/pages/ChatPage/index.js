/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import { Button, InputNumber } from "antd";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import CryptoTransferMessage from "../../components/CryptoTransferMessage";

const TRANSFER_MESSAGES = [
  {
    id: 2,
    transferType: "receive",
    amount: 1,
    timestamp: "2022-04-17T07:03:11.134Z",
    currentStatus: "completed",
  },
  {
    id: 2,
    transferType: "receive",
    amount: 1,
    timestamp: "2022-04-17T07:03:11.134Z",
    currentStatus: "completed",
  },
  {
    id: 2,
    transferType: "receive",
    amount: 1,
    timestamp: "2022-04-17T07:03:11.134Z",
    currentStatus: "completed",
  },
  {
    id: 3,
    transferType: "send",
    amount: 0.1,
    timestamp: "2022-04-17T09:03:11.134Z",
    currentStatus: "mining",
  },
  {
    id: 6,
    transferType: "send",
    amount: 0.4,
    timestamp: "2022-04-17T10:18:46.853Z",
    currentStatus: "pending_approval",
  },
  {
    id: 4,
    transferType: "receive",
    amount: 0.1,
    timestamp: "2022-04-17T11:18:46.853Z",
    currentStatus: "pending_approval",
  },
];

const ChatPage = () => {
  const [messages, setMessages] = useState(TRANSFER_MESSAGES);
  const messagesElement = useRef(null);

  useEffect(() => {
    if (messagesElement) {
      const { current: ele } = messagesElement;
      ele.scroll({ top: ele.scrollHeight, behavior: "smooth" });

      messagesElement.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  return (
    <div className="chat-page">
      <div className="chat-page-input">
        <InputNumber min={0} style={{ width: "100%" }} placeholder="Amount" />
        <Button type="primary">Request</Button>
        <Button type="primary">Send</Button>
      </div>
      <div className="chat-page-messages" ref={messagesElement}>
        {_.map(messages, (message) => (
          <CryptoTransferMessage key={message.id} {...message} />
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
