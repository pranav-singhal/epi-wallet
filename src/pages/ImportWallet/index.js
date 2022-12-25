import React, { useState } from "react";
import {Button, Form, Input, PageHeader, Typography} from "antd";
import _ from "lodash";
import Web3, { PASSWORD } from "../../helpers/Web3";
import { createNewUser, subscribeToNotifications } from "../../api";
import { ImportOutlined } from "@ant-design/icons";
const { Title, Paragraph } = Typography;

const PROJECT_NAME = "EPI Wallet";

const ImportWalletPage = ({ userDetails }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setWallet = (values) => {
    setIsSubmitting(true);
    const walletObject = Web3.getWalletObjectFromPrivateKey(values.pvtKey); // form validation ensures this is valid

    createNewUser({
      username: values.username,
      address: walletObject.address,
    })
      .then((_res) => {
        Web3.addNewWallet(values.pvtKey, PASSWORD);
        localStorage.setItem("current_user", values.username);
        return subscribeToNotifications();
      })
      .then((notifResult) => {
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="import-wallet">
      <PageHeader
        avatar={{ src: "https://i.imgur.com/ZAE8cku.png" }}
        title={PROJECT_NAME}
      />
      <div className="import-wallet-container">
        <div className="import-wallet-container-head">
          <ImportOutlined />
          <Title level={3} type="secondary">
            Import using Private Key
          </Title>
        </div>
        <div className="create-wallet-container-description">
          <Paragraph>
            Wallet will use the <b>Private Key</b> entered here, and link it with the provided <b>Username</b>.
            Later anybody can use your username to send or request assets to/from you. Without the hassle of sharing
            the public address through other messaging channels.
          </Paragraph>
          <Paragraph>
            You will later be able to export that private key from the <b>Settings</b> section.
          </Paragraph>
        </div>
        <div className="import-wallet-container-form">
          <Form name="import wallet" onFinish={setWallet} disabled={isSubmitting}>
            <Form.Item
              label="Username"
              name="username"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter a username.",
                },
                {
                  message: "Username already taken.",
                  validator: (__, value) => {
                    const takenUserNames = _.keys(userDetails);
                    return _.includes(takenUserNames, value)
                      ? Promise.reject()
                      : Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Private Key"
              name="pvtKey"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter a private key.",
                },
                {
                  message: "Private key is invalid.",
                  validator: (_, value) => {
                    return Web3.getWalletObjectFromPrivateKey(value)
                      ? Promise.resolve()
                      : Promise.reject();
                  },
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Import
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ImportWalletPage;
