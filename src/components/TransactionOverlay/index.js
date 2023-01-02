/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 30/12/22
 */
import ConfirmTransaction from "./ConfirmTransaction";
import { Button, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useUserDetails from "../../hooks/useUserDetails";
import _ from "lodash";
import useChainContext from "../../hooks/useChainContext";
import BottomOverlayLayout from "../Layouts/BottomOverlayLayout";
import TransactionDetails from "./TransactionDetails";
import { useNavigate } from "react-router-dom";
import {sendMessageForRequest} from "../../api";

const ENTER_DETAILS = "enter_details";
const CONFIRM_TRANSACTION = "confirm_transaction";

const STEP_TITLES = {
  [ENTER_DETAILS]: "Transaction Details",
  [CONFIRM_TRANSACTION]: "Confirm Transaction",
};

const TransactionOverlay = (props) => {
  const [Web3] = useChainContext();
  const gas = 53000;
  const [gasPrice, setGasPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, userDetailsLoaded] = useUserDetails();

  // Transaction Details - Start
  const [amount, setAmount] = useState(0);
  const [toUsername, setToUsername] = useState("");
  // Transaction Details - End

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const activeStepKey = _.isEmpty(steps) ? null : steps[activeStepIndex];

  const totalGasAmount = gas * gasPrice;
  const currentUserName = localStorage.getItem("current_user");
  const fromDetails = _.get(userDetails, currentUserName);
  const toDetails = _.get(userDetails, toUsername);

  const navigate = useNavigate();

  useEffect(() => {
    const transactionSteps = [];
    if (_.isEmpty(props.to) || !props.value) {
      transactionSteps.push(ENTER_DETAILS);
    } else {
      props.value && setAmount(props.value);
      !_.isEmpty(props.to) && setToUsername(props.to);
    }

    transactionSteps.push(CONFIRM_TRANSACTION);

    setSteps(transactionSteps);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      Web3.getGasPriceInEth().then((price) => {
        setGasPrice(price);

        setIsLoading(false);
      });
    }, 1500);
  });

  const onApprove = () => {
    Web3.sendTransaction(
      toDetails,
      amount,
      gas,
      props.transactionId,
      props.qrId
    ).then(() => {
      props.shouldNavigateToReceiver && navigate(`/chat?to=${toUsername}`);
      props.onApprove();
    });
  };

  const getContent = () => {
    const transactionType = props.type
    switch (activeStepKey) {
      case ENTER_DETAILS:
          return (
              <TransactionDetails
                  type={transactionType}
                  users={_.values(userDetails)}
                  onNext={(amount, selectedUser) => {
                    if (transactionType === 'send') {
                      setAmount(amount);
                      setToUsername(selectedUser);
                      setActiveStepIndex(activeStepIndex + 1);
                    }

                    if (transactionType === 'request') {
                      setIsLoading(true);
                      sendMessageForRequest({
                        newMessageAmount: amount,
                        threadUserName: selectedUser
                      })
                          .then(() => {
                            navigate(`/chat?to=${selectedUser}`);
                          })
                    }
                }}
              />
          );
      case CONFIRM_TRANSACTION:
        return (
          <ConfirmTransaction
            from={fromDetails}
            to={toDetails}
            value={amount}
            gas={totalGasAmount}
            onDecline={props.onDecline}
            onApprove={onApprove}
          />
        );
    }
  };

  if (
    isLoading ||
    !userDetailsLoaded ||
    _.isEmpty(steps) ||
    _.isEmpty(activeStepKey)
  ) {
    return (
      <BottomOverlayLayout className="transaction">
        <div className="transaction-spinner">
          <Spin tip="Generating Transaction..." />
        </div>
      </BottomOverlayLayout>
    );
  }

  return (
    <BottomOverlayLayout className="transaction">
      <div className="transaction-heading">
        <div>{STEP_TITLES[activeStepKey]}</div>
        <Button
          shape="circle"
          type="default"
          icon={<CloseOutlined />}
          size="small"
          onClick={props.onCancel}
        />
      </div>
      <div className="transaction-content">{getContent()}</div>
    </BottomOverlayLayout>
  );
};

TransactionOverlay.propTypes = {
  to: PropTypes.string,
  value: PropTypes.number,
  qrId: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  transactionId: PropTypes.number,
  onApprove: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  shouldNavigateToReceiver: PropTypes.bool,
};

TransactionOverlay.defaultProps = {
  shouldNavigateToReceiver: false,
};

export default TransactionOverlay;
