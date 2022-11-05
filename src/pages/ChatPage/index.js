/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import { Button, InputNumber, message } from "antd";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { BASE_URL, getCurrentUser, fetchMessages, getCurrentUserPublicKey } from "../../api";
import CryptoTransferMessage from "../../components/CryptoTransferMessage";
import useMessageApi from "../../hooks/useMessageApi";

const ChatPage = ({threadUser}) => {
  const [newMessageAmount, setNewMessageAmount] = useState(0);
  const messagesElement = useRef(null);
  const [messagesArray, setMessageArray] = useState();

  

  useEffect(() => {
    fetchMessages(threadUser)
    .then((res) => {  
        setMessageArray(res.messages);
    })

}, []);

const handleSend = (txHash = 'someRandomHash') => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  fetch(`${BASE_URL}/message`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      "type": "recieved",
      "sender": getCurrentUser(),
      "recipient": threadUser,
      "txDetails": {
        "amount": newMessageAmount,
        hash: txHash

      },
      meta: {
        publicKey: getCurrentUserPublicKey()
      }
    }),
  })
  .then(response => response.json())
  .then(result => {
    fetchMessages(threadUser)
    .then((res) => {
      setMessageArray(res.messages)
    })
  })
  .catch(error => console.log('error', error));
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
        "recipient": threadUser,
        "txDetails": {
          "amount": newMessageAmount
        }
      }),
    })
    .then(response => response.json())
    .then(result => {
      fetchMessages(threadUser)
      .then((res) => {
        setMessageArray(res.messages)
      })
    })
    .catch(error => console.log('error', error));
  }

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
        <InputNumber min={0} style={{ width: "100%" }} placeholder="Amount" onChange={setNewMessageAmount} />
        <Button type="primary" onClick={handleRequest} >Request</Button>
        <Button type="primary" onClick={() => {handleSend()}}>Send</Button>
      </div>
      <div className="chat-page-messages" ref={messagesElement}>
        {_.map(_.orderBy(messagesArray, ['createdAt'], ['asc']), (message) => (
          <CryptoTransferMessage key={message.id} {...message} />
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
