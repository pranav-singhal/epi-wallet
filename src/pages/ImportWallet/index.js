import React, { useEffect, useState } from "react";
import {Button, Divider, Form, Input, Typography} from "antd";
import _ from "lodash";
import { PASSWORD } from "../../helpers/Web3";
import { createNewUser } from "../../api";
import { ImportOutlined } from "@ant-design/icons";
import SetupWalletLayout from "../../components/Layouts/SetupWalletLayout";
import useChainContext from "../../hooks/useChainContext";
import { subscribeToWebNotifications } from "../../helpers";
import useUserDetails from "../../hooks/useUserDetails";
const { Title, Paragraph } = Typography;

const ImportWalletPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [web3] = useChainContext();
  const [userDetails, isUserDetailsLoaded] = useUserDetails();
  const [inputPrivateKey, setInputPrivateKey] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [usernameValidationStatus, setUsernameValidationStatus] = useState('valid')
  const [form] = Form.useForm();

  const setWallet = (values) => {
    setIsSubmitting(true);
    const walletObject = web3.getWalletObjectFromPrivateKey(values.pvtKey); // form validation ensures this is valid

    (() => {
      const takenUsernames = _.keys(userDetails)
      return _.includes(takenUsernames, values.username) ? Promise.resolve() :
      createNewUser({
        username: values.username,
        address: walletObject.address,
      })
    })()
      .then((_res) => {
        web3.addNewWallet(values.pvtKey, PASSWORD);
        localStorage.setItem("current_user", values.username);
        const signer = web3?.getEthersWallet();
        return subscribeToWebNotifications(signer);
      })
      .then(() => {
        window.location.href = '/';
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {

    // trigger the validations for both fields when either of them changes.
    // username validation is dependant on the input pvtKey. Thus the validations for both are triggered
    // when either of them chagnes
      form.validateFields(['username', 'pvtKey'])
    .then((res) => {
      console.log("validation success: ", res)
    })
    .catch((err) => {
      console.log("validation error: ", err)
    })
  }, [inputPrivateKey, inputUsername])

  const validateInputUsername = () => {

    const takenUsernames = _.keys(userDetails)
    if (_.includes(takenUsernames, inputUsername)) {
      if (inputPrivateKey) {
        const walletObject = web3.getWalletObjectFromPrivateKey(inputPrivateKey)
        if (walletObject?.address) {
            const takenUsernameAddress = userDetails[inputUsername].address

            if (walletObject.address === takenUsernameAddress) {
              // if there is a private key input and username is already taken
              // we can create wallet if the adderss of the input key matches the address stored with the
              // corresponding username
              setUsernameValidationStatus('valid')
              return Promise.resolve()
            }
        }
      }
      
      setUsernameValidationStatus('error')
      return Promise.reject()
    }
      // if the input username is not already taken, it can be used with any private key
      setUsernameValidationStatus('valid')
      return Promise.resolve()
  }

  if (isUserDetailsLoaded) {
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
            Wallet will use the <b>Private Key</b> entered here, and link it with the provided <b>Username</b>.
            Later anybody can use your username to send or request assets to/from you. Without the hassle of sharing
            the public address through other messaging channels.
          </Paragraph>
          <Paragraph>
            You will later be able to export that private key from the <b>Settings</b> section.
          </Paragraph>
        </div>
        <Divider />
        <div className="import-wallet-form">
          <Form name="import wallet" form={form} onFinish={setWallet} disabled={isSubmitting}>
            <Form.Item
              label="Username"
              name="username"
              hasFeedback
              validateStatus={usernameValidationStatus}
              rules={[
                {
                  required: true,
                  message: "Please enter a username.",
                },
                {
                  message: 'This username is already associated with a different account.',
                  validator: validateInputUsername
                }
              ]}
            >
              <Input
              onInput={e => setInputUsername(e.target.value)}
              />
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
                    setInputPrivateKey(value)
                    return web3.getWalletObjectFromPrivateKey(value)
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
      </SetupWalletLayout>
    );
  }

  // TODO - return loading screen
  
};

export default ImportWalletPage;
