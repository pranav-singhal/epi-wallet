/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import classNames from "classnames";
import moment from "moment";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

const CryptoTransferMessage = (props) => {
  const {
    transferType,
    amount,
    crypto = "ETH",
    timestamp,
    currentStatus,
  } = props;

  const getMessageStatus = () => {
    switch (currentStatus) {
      case "mining":
        return "In Progress";
      case "pending_approval":
        return "Pending Approval";
      case "completed":
      default:
        return "Done";
    }
  };

  return (
    <div className="crypto-message">
      <div
        className={classNames("crypto-message-card", {
          "float-right": transferType === "send",
        })}
      >
        <div className="crypto-message-card__type">
          {transferType === "send" ? "From you" : "To you"}
        </div>
        <div className="crypto-message-card__amount">
          {amount} {crypto}
          {currentStatus === "pending_approval" && transferType === "send" && (
            <Button type="primary" shape="round">
              Approve
            </Button>
          )}
        </div>

        <div className="crypto-message-card__footer">
          <div className="crypto-message-card__footer-status">
            {currentStatus === "completed" ? (
              <CheckCircleOutlined />
            ) : (
              <ClockCircleOutlined />
            )}
            <span>{getMessageStatus()}</span>
          </div>
          <div className="crypto-message-card__footer-timestamp">
            {moment(timestamp).fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTransferMessage;
