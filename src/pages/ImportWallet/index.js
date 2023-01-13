import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Input, Typography } from "antd";
import _ from "lodash";
import { PASSWORD } from "../../helpers/Web3";
import { createNewUser } from "../../api";
import { ImportOutlined } from "@ant-design/icons";
import SetupWalletLayout from "../../components/Layouts/SetupWalletLayout";
import useChainContext from "../../hooks/useChainContext";
import { isSafariIos, isValidUsername, isWebView, subscribeToWebNotifications } from "../../helpers";
import useUserDetails from "../../hooks/useUserDetails";
import FullPageLoader from "../../components/FullPageLoader";
const { Title, Paragraph } = Typography;

const CLAIM_USING_PRIVATE_KEY_MSG =
  "Provided username is already taken, but you can claim it by providing the associated private key";

const ImportWalletPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [web3] = useChainContext();
  const [userDetails, isUserDetailsLoaded] = useUserDetails();
  const [form] = Form.useForm();

  const setWallet = (values) => {
    setIsSubmitting(true);
    const walletObject = web3.getWalletObjectFromPrivateKey(values.pvtKey); // form validation ensures this is valid

    (() => {
      const takenUsernames = _.keys(userDetails);
      return _.includes(takenUsernames, values.username)
        ? Promise.resolve()
        : createNewUser({
            username: values.username,
            address: walletObject.address,
          });
    })()
      .then((_res) => {
        web3.addNewWallet(values.pvtKey, PASSWORD);
        localStorage.setItem("current_user", values.username);
        const signer = web3?.getEthersWallet();
        
        // attempt to subscribe to web notifications only if its not webview or safari opened on iphone/ipad
        return (!isSafariIos() && !isWebView()) ? subscribeToWebNotifications(signer): Promise.resolve();
      })
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => console.error(err));
  };

  const validateInputUsername = (getFieldValue, inputUsername) => {
    const takenUsernames = _.keys(userDetails),
      inputPrivateKey = getFieldValue("pvtKey");

    if (!_.includes(takenUsernames, inputUsername)) {
      return Promise.resolve();
    }

    if (!inputPrivateKey) {
      return Promise.reject(CLAIM_USING_PRIVATE_KEY_MSG);
    }

    const walletObject = web3.getWalletObjectFromPrivateKey(inputPrivateKey);

    if (!walletObject?.address) {
      return Promise.reject(CLAIM_USING_PRIVATE_KEY_MSG);
    }

    const takenUsernameAddress = userDetails[inputUsername].address;

    if (walletObject.address === takenUsernameAddress) {
      return Promise.resolve();
    }

    return Promise.reject(CLAIM_USING_PRIVATE_KEY_MSG);
  };

  if (!isUserDetailsLoaded) {
    return <FullPageLoader removeMessage />;
  }

  return (
    <SetupWalletLayout className="import-wallet">
      <div className="import-wallet-head">
        <ImportOutlined />
        <Title level={3} type="secondary">
          Import using Private Key
        </Title>
      </div>
      <div className="create-wallet-description">
        <Paragraph>
          Wallet will use the <b>Private Key</b> entered here, and link it with
          the provided <b>Username</b>. Later anybody can use your username to
          send or request assets to/from you. Without the hassle of sharing the
          public address through other messaging channels.
        </Paragraph>
        <Paragraph>
          You will later be able to export that private key from the{" "}
          <b>Settings</b> section.
        </Paragraph>
      </div>
      <Divider />
      <div className="import-wallet-form">
        <Form
          name="import wallet"
          form={form}
          onFinish={setWallet}
          disabled={isSubmitting}
        >
          <Form.Item
            label="Username"
            name="username"
            hasFeedback
            rules={[
              ({ getFieldValue }) => {
                return {
                  validator: ($0, value) => {
                    if (_.isEmpty(value)) {
                      return Promise.reject("Please enter a username.");
                    }

                    if (!isValidUsername(value)) {
                      return Promise.reject(
                        "No special characters or spaces allowed"
                      );
                    }

                    return validateInputUsername(getFieldValue, value);
                  },
                };
              },
            ]}
            normalize={(value) => _.toLower(value)}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Private Key"
            name="pvtKey"
            hasFeedback
            rules={[
              ({ validateFields }) => {
                validateFields(["username"]);
                return {
                  validator: ($0, value) => {
                    if (_.isEmpty(value)) {
                      return Promise.reject("Provide a valid Private Key");
                    }

                    return web3.getWalletObjectFromPrivateKey(value)
                      ? Promise.resolve()
                      : Promise.reject("Provide a valid Private Key");
                  },
                };
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
    </SetupWalletLayout>
  );
};

export default ImportWalletPage;
