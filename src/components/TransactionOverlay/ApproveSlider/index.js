/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 29/12/22
 */
import SwipeButton from "./SwipeButton";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Button } from "antd";

const ApproveSlider = (props) => {
  const [isTransactionApproving, setIsTransactionApproving] = useState(false);
  const [isTransactionDeclining, setIsTransactionDeclining] = useState(false);

  const onApprove = () => {
    setIsTransactionApproving(true);
    props.onApprove();
  };

  useEffect(() => {
    if (props.isError) {
      setIsTransactionApproving(false);
    }
  }, [props.isError]);

  return (
    <div className={classnames("approve-buttons", props.className)}>
      <Button
        className={classnames("approve-buttons-decline", {
          "is-disabled": isTransactionApproving || isTransactionDeclining,
        })}
        type="danger"
        shape="circle"
        icon={<CloseCircleOutlined />}
        onClick={() => {
          if (isTransactionDeclining || isTransactionApproving) {
            return;
          }

          setIsTransactionDeclining(true);
          props.onDecline();
        }}
        loading={isTransactionDeclining}
      />
      <SwipeButton
        setIsError={props.setIsError}
        isError={props.isError}
        onComplete={onApprove}
        isDisabled={isTransactionDeclining}
      />
    </div>
  );
};

ApproveSlider.propTypes = {
  onApprove: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ApproveSlider;
