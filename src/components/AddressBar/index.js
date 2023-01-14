import React from "react";
import { CopyOutlined } from "@ant-design/icons";
import { Col, message, Row } from "antd";
import _ from "lodash";

const AddressBar = ({ currentUserDetails }) => {
  const getAddress = () => {
    if (_.isEmpty(currentUserDetails)) {
      return null;
    }

    const fullAddress = currentUserDetails.address,
      beginning = fullAddress.slice(0, 7),
      ending = fullAddress.slice(-6);
    return `${beginning}...${ending}`;
  };

  return (
    <Row
      gutter={10}
      className="wallet-info__name-address"
      onClick={() => {
        if (window.webkit) {
          window.webkit.messageHandlers.observer.postMessage(
            `ethereum:${currentUserDetails.address}`
          );
        }
        navigator?.clipboard?.writeText(currentUserDetails.address);
        message.success({
          content: <span>Copied</span>,
          className: "message-notification",
        });
      }}
    >
      <Col> {_.toUpper(getAddress())} </Col>
      <Col>
        <CopyOutlined />
      </Col>
    </Row>
  );
};

export default AddressBar;
