import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Button, Form, Input, PageHeader, Typography} from "antd";
import _ from "lodash";
import Web3, { PASSWORD } from "../../helpers/Web3";
import {
  createNewUser,
  subscribeToNotifications,
} from "../../api";
import {PlusSquareOutlined} from "@ant-design/icons";
import useUserDetails from "../../hooks/useUserDetails";

const { Title, Paragraph } = Typography;

const PROJECT_NAME = "EPI Wallet";

const CreateWallet = () => {
  const navigate = useNavigate();

  const [userDetails] = useUserDetails();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setWallet = (values) => {
    setIsSubmitting(true);
    const walletObject = Web3.createNewWalletWithEntropy();

    createNewUser({
      username: values?.username,
      address: walletObject?.address,
    })
      .then((_res) => {
        Web3.addNewWallet(walletObject?.privateKey, PASSWORD);

        localStorage.setItem("current_user", values?.username);

        return subscribeToNotifications();
      })
      .then(() => navigate("/dashboard"))
      .catch(console.error);
  };

  if (!userDetails) {
    return null;
  }

  return (
    <div className="create-wallet">
      <PageHeader
        avatar={{ src: "https://i.imgur.com/ZAE8cku.png" }}
        title={PROJECT_NAME}
      />
      <div className="create-wallet-container">
        <div className="create-wallet-container-head">
          <PlusSquareOutlined />
          <Title level={3} type="secondary">
            Create a New Wallet
          </Title>
        </div>
        <div className="create-wallet-container-description">
          <Paragraph>
            A <b>Private Key</b> will be auto generated for you, when you create a new wallet using the following form.
          </Paragraph>
          <Paragraph>
            Wallet will use the <b>Private Key</b> generated here, and link it with the provided <b>username</b>.
            Later anybody can use your username to send or request assets to/from you. Without the hassle of sharing
            the public address through other messaging channels.
          </Paragraph>
          <Paragraph>
            You will later be able to export that private key from the <b>Settings</b> section.
          </Paragraph>
        </div>
        <div className="create-wallet-container-form">
          <Form name="create-wallet" onFinish={setWallet} disabled={isSubmitting}>
            <Form.Item
              label="Username"
              name="username"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please enter a username",
                },
                {
                  message: "This username is already taken",
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Create new wallet
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateWallet;
