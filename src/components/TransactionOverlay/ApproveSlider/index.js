/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 29/12/22
 */
import SwipeButton from "./SwipeButton";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const ApproveSlider = (props) => {
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);

  const onApprove = () => {
    setIsTransactionProcessing(true);
    props.onApprove();
  };

  return (
    <div className={classnames("approve-buttons", props.className)}>
      <div
        className={classnames("approve-buttons-decline", {
          "is-disabled": isTransactionProcessing,
        })}
        onClick={props.onDecline}
      >
        <CloseCircleOutlined style={{ fontSize: "16px" }} />
      </div>
      <SwipeButton onComplete={onApprove} />
    </div>
  );
};

ApproveSlider.propTypes = {
  onApprove: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ApproveSlider;
