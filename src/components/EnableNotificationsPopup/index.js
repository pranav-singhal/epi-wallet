import { Button, Col, Row } from "antd";
import React from "react";
import { TransactionOverlayContainer } from "../TransactionOverlay";
import "./style.scss";

const EnableNotificationsPopup = () => {
    return (
        <TransactionOverlayContainer>
      <div className="transaction-heading">
        <div>Enable Notifications</div>
        
        
      </div>
      <div className="transaction-content">
          So that you never miss a message from your friends when they send you coins
        </div>
        <div className="notifications-footer">
          <Row>
            <Col span={8} />
            <Col span={16}>
            <Button type="primary" className="notifications-footer__enable-button">
            Enable Notifications
          </Button>
            </Col>
            
            </Row> 
          

        </div>
      </TransactionOverlayContainer>
    )
}

export default EnableNotificationsPopup;