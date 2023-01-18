/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import { Button, Empty, InputNumber } from "antd";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import {
  fetchMessages,
  sendMessageForRequest,
  updateTransactionStatus,
} from "../../api";
import CryptoTransferMessage from "../../components/CryptoTransferMessage";
import { useNavigate } from "react-router-dom";
import useQuery from "../../hooks/useQuery";
import MainLayout from "../../components/Layouts/MainLayout";
import useUserDetails from "../../hooks/useUserDetails";
import { toTitleCase } from "../../helpers";
import FullPageLoader from "../../components/FullPageLoader";
import TransactionConfirmationOverlay from "../../components/TransactionOverlay";
import useTransaction from "../../hooks/useTransaction";
import useChainContext from "../../hooks/useChainContext";
import ChainSwitcher from "../../components/ChainSwitcher";

const ChatPage = () => {
  const [newMessageAmount, setNewMessageAmount] = useState(0);
  const [userDetails, usersLoaded] = useUserDetails();
  const [isLoading, setIsLoading] = useState(true);
  const messagesElement = useRef(null);
  const [messagesArray, setMessageArray] = useState();
  const navigate = useNavigate();
  const query = useQuery();
  const to = query.get("to");
  const [,,chainId] = useChainContext();

  const [sendingRequest, setSendingRequest] = useState(false);

  const threadUser = _.get(userDetails, to, {});

  const [shouldShowErrorState, setShouldShowErrorState] = useState(false);
  const [
    shouldShowTransactionPopover,
    transactionDetails,
    initiateTransaction,
    endTransaction,
  ] = useTransaction();

  useEffect(() => {
    if (!usersLoaded) {
      return;
    }

    if (_.isEmpty(threadUser)) {
      setIsLoading(false);
      setShouldShowErrorState(true);
      return;
    }

    fetchMessages(to, chainId).then((res) => {
      setMessageArray(res.messages);
      setIsLoading(false);
    });
  }, [usersLoaded, chainId]);

  const handleSend = () => {
    initiateTransaction({
      to,
      value: newMessageAmount,
      chainId
    });
  };

  const handleRequest = () => {
    setSendingRequest(true);

    sendMessageForRequest({
      newMessageAmount,
      threadUserName: to,
      chainId
    })
      .then(() => {
        return reFetchMessages();
      })
      .catch((error) => console.error(error))
      .finally(() => setSendingRequest(false));
  };

  useEffect(() => {
    if (isLoading || shouldShowErrorState) {
      return;
    }

    if (!messagesElement) {
      return;
    }

    const { current: ele } = messagesElement;

    if (!ele) {
      return;
    }

    ele.scroll({ top: ele.scrollHeight, behavior: "smooth" });

    ele.addEventListener("DOMNodeInserted", (event) => {
      const { currentTarget: target } = event;
      target.scroll({ top: target.scrollHeight, behavior: "smooth" });
    });
  }, [isLoading]);

  const reFetchMessages = () => {
    return fetchMessages(to, chainId).then((res) => {
      setNewMessageAmount(0);
      setMessageArray(res.messages);
    });
  };

  if (isLoading) {
    return <FullPageLoader message="Fetching transactions..." />;
  }

  if (shouldShowErrorState) {
    return (
      <MainLayout onBackClick={() => navigate("/")}>
        <div className="chat-page-error-state">
          <Empty description="User does not exist in the EPI Database" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      hideLogo
      className="chat-page"
      showAppName={false}
      onBackClick={() => navigate("/")}
      headerTitle={toTitleCase(threadUser.name)}
    >
      <ChainSwitcher />
      <div className="chat-page-messages" ref={messagesElement}>
        {_.map(_.orderBy(messagesArray, ["createdAt"], ["asc"]), (message) => (
          <CryptoTransferMessage
            key={message.id}
            message={message}
            handleApprove={() => {
              initiateTransaction({
                to,
                value: parseFloat(message.amount),
                transactionId: message.transactionId,
              });
            }}
          />
        ))}
      </div>
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
          disabled={
            !_.isNumber(newMessageAmount) ||
            newMessageAmount <= 0 ||
            sendingRequest
          }
          loading={sendingRequest}
        >
          Request
        </Button>
        <Button
          type="primary"
          onClick={() => {
            handleSend();
          }}
          loading={shouldShowTransactionPopover}
          disabled={
            !_.isNumber(newMessageAmount) ||
            newMessageAmount <= 0 ||
            shouldShowTransactionPopover
          }
        >
          Send
        </Button>
      </div>
      {shouldShowTransactionPopover && (
        <TransactionConfirmationOverlay
          {...transactionDetails}
          onApprove={() => {
            reFetchMessages().then(() => {
              endTransaction();
            });
          }}
          onDecline={() => {
            updateTransactionStatus({
              txStatus: "declined",
              id: transactionDetails?.transactionId,
            })
              .then(() => {
                return reFetchMessages();
              })
              .then(() => {
                endTransaction();
              });
          }}
          onCancel={endTransaction}
        />
      )}
    </MainLayout>
  );
};

export default ChatPage;
