/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 30/12/22
 */
import ConfirmTransaction from "./ConfirmTransaction";
import { Button, Space, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Web3 from "../../helpers/Web3";
import useUserDetails from "../../hooks/useUserDetails";
import _ from "lodash";

const TransactionOverlayContainer = (props) => {
  return (
    <div className="transaction">
      <div className="transaction-overlay" />
      <div className="transaction-popup">
        <div className="transaction-popup-dialog">{props.children}</div>
      </div>
    </div>
  );
};

const TransactionOverlay = (props) => {
  const gas = 30000;
  const [gasPrice, setGasPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, loaded] = useUserDetails();

  const { to, value, qrId, transactionId } = props;

  const totalGasAmount = gas * gasPrice;
  const currentUserName = localStorage.getItem("current_user");
  const fromDetails = _.get(userDetails, currentUserName);
  const toDetails = _.get(userDetails, to);

  useEffect(() => {
    setTimeout(() => {
      Web3.getGasPriceInEth().then((price) => {
        setGasPrice(price);

        setIsLoading(false);
      });
    }, 1500);
  });

  const onApprove = () => {
    Web3.sendTransaction(to, value, gas, transactionId, qrId).then(() => {
      props.onApprove();
    });
  };

  if (isLoading || !loaded) {
    return (
      <TransactionOverlayContainer>
        <div className="transaction-spinner">
          <Spin tip="Generating Transaction..." />
        </div>
      </TransactionOverlayContainer>
    );
  }

  return (
    <TransactionOverlayContainer>
      <div className="transaction-heading">
        <div>Confirm Transaction</div>
        <Button
          shape="circle"
          type="default"
          icon={<CloseOutlined />}
          size="small"
          onClick={props.onCancel}
        />
      </div>
      <div className="transaction-content">
        <ConfirmTransaction
          from={fromDetails}
          to={toDetails}
          value={value}
          gas={totalGasAmount}
          onDecline={props.onDecline}
          onApprove={onApprove}
        />
      </div>
    </TransactionOverlayContainer>
  );
};

TransactionOverlay.propTypes = {
  to: PropTypes.string,
  value: PropTypes.number,
  qrId: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  transactionId: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  onApprove: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

TransactionOverlay.defaultProps = {
  to: "pranav",
  value: 0.1,
};

export default TransactionOverlay;
