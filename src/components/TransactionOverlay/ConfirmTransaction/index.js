/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 30/12/22
 */
import ApproveSlider from "../ApproveSlider";
import { Avatar } from "antd";
import { toTitleCase } from "../../../helpers";
import PropTypes from "prop-types";
import { RightOutlined } from "@ant-design/icons";

const Account = (props) => {
  const { name, avatar } = props;

  return (
    <div className="account">
      <div className="account-avatar">
        <Avatar src={avatar} />
      </div>
      <div className="account-name">{toTitleCase(name)}</div>
    </div>
  );
};

Account.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};

const ConfirmTransaction = (props) => {
  const { from, to } = props;
  return (
    <div className="confirm-transaction">
      <div className="confirm-transaction-accounts">
        <Account name={from.name} avatar={from.avatar} />
        <RightOutlined style={{ fontSize: "18px" }} />
        <Account name={to.name} avatar={to.avatar} />
      </div>
      <div className="confirm-transaction-amounts">
        <div>Value: {props.value} ETH</div>
        <div>Gas: {props.gas} ETH</div>
        <div>
          <strong>Total: {props.gas + props.value} ETH</strong>
        </div>
      </div>
      <ApproveSlider
        onApprove={props.onApprove}
        onDecline={props.onDecline}
        className="confirm-transaction-cta"
      />
    </div>
  );
};

ConfirmTransaction.propTypes = {
  from: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }),
  to: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }),
  value: PropTypes.number.isRequired,
  gas: PropTypes.number.isRequired,
  onApprove: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired
};

export default ConfirmTransaction;
