import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Form, Input} from "antd";
import _ from 'lodash';
import Web3, { PASSWORD } from "../../helpers/Web3";
import {createNewUser, getAllUsers, subscribeToNotifications} from "../../api";

const CreateWallet = () => {
    const [userDetails, setUserDetails] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        getAllUsers()
            .then(res => setUserDetails(res?.users))
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const setWallet = (values) => {
        setIsSubmitting(true);
        const walletObject = Web3.createNewWalletWithEntropy()
        createNewUser({
            username: values?.username,
            address: walletObject?.address
        })
            .then(_res => {
                Web3.addNewWallet(walletObject?.privateKey, PASSWORD);
                localStorage.setItem('current_user', values?.username);
                return subscribeToNotifications();
            })
            .then(() => navigate("/dashboard"))
            .catch(console.error)
    }

    if (!userDetails) {
        return null
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

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        shape='round'
                    >
                        Create new wallet
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
};

export default CreateWallet;
