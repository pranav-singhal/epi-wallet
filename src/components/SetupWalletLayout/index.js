/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 27/12/22
 */
import React from "react";
import { Avatar, Typography } from "antd";
import classnames from "classnames";

const { Title } = Typography;

const PROJECT_NAME = "EPI Wallet";

const SetupWalletLayout = (props) => {
  return (
    <div className={classnames("setup-wallet", props.className)}>
      <div className="setup-wallet-header">
        <Avatar size={64} src="https://i.imgur.com/ZAE8cku.png" />
        <Title level={3}>{PROJECT_NAME}</Title>
      </div>
      <div className="setup-wallet-content">{props.children}</div>
    </div>
  );
};

export default SetupWalletLayout;
