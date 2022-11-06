import React, {useState} from 'react';
import {Button, Form, Input} from "antd";
import _ from 'lodash';
import Web3, {PASSWORD} from "../../helpers/Web3";
import { createNewUser, subscribeToNotifications } from "../../api";

const ImportWalletPage = ({userDetails}) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const setWallet = (values) => {

      setIsSubmitting(true);
      const walletObject = Web3.getWalletObjectFromPrivateKey(values.pvtKey); // form validation ensures this is valid

      createNewUser({
          username: values.username,
          address: walletObject.address
      })
        .then(_res => {
            Web3.addNewWallet(values.pvtKey, PASSWORD);
            localStorage.setItem('current_user', values.username);
            return subscribeToNotifications();
        })
        .then((notifResult) => {
            window.location.reload();
        })
        .catch((err) => console.error(err));
    }

    return (
        <div className='import-wallet'>
          <Form
              name='import wallet'
              onFinish={setWallet}
              disabled={isSubmitting}
          >
            <Form.Item
              label='Username'
              name='username'
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please enter a username'
                },
                {
                  message: 'This username is already taken',
                  validator: (__, value) => {
                      const takenUserNames = _.keys(userDetails)
                      return _.includes(takenUserNames, value) ? Promise.reject() : Promise.resolve();
                  }
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Private Key'
              name='pvtKey'
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Private key cannot be empty'
                },
                {
                  message: 'Invalid private key added',
                  validator: (_, value) => {
                    return Web3.getWalletObjectFromPrivateKey(value) ? Promise.resolve() : Promise.reject();
                  }
                }
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={isSubmitting} disabled={isSubmitting} >
                    Submit
                </Button>
            </Form.Item>
          </Form>
        </div>
    )
};

export default ImportWalletPage;
