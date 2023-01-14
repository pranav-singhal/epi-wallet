import { LinkOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import _ from "lodash";
import React from "react";
import { BLOCK_EXPLORER_BASE_URL } from "../../helpers/Web3";
import CopyWalletAddress from "../CopyWalletAddress";

const AddressBar = ({currentUserDetails}) => {
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
    <Row style={{alignItems: 'center'}} gutter={12}>
        <Col>
            <Row
            gutter={10}
            className="wallet-info__name-address"
            onClick={() => {
              window.open(
                `${BLOCK_EXPLORER_BASE_URL}/address/${currentUserDetails.address}`
              );
            }}
            >
                <Col> {_.toUpper(getAddress())} </Col>
                <Col> <LinkOutlined /> </Col>
            </Row>
        </Col>
        <Col
            className="wallet-info__name-address"
        >
            <CopyWalletAddress currentUserDetails={currentUserDetails} />
        </Col>
    </Row>
)}

export default AddressBar;
