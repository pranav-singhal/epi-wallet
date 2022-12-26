import React, {useState} from 'react';
import {AutoComplete, Button, Col, Input, InputNumber, Row} from "antd";
import _ from 'lodash'

import AppHeader from "../AppHeader";
import {useNavigate} from "react-router-dom";
import useUserDetails from "../../hooks/useUserDetails";
import {sendMessageForRequest} from "../../api";

const NewRequestPage = () => {
    const navigate = useNavigate()
    const [userDetails] = useUserDetails();

    const [selectedUser, setSelectedUser] = useState()
    const [amount, setAmount] = useState();
    const nonVendorUserDetails = _.filter(userDetails, (_user) => {
        return _user.user_type === 'user'
    })

    const userOptions = _.map(_.values(nonVendorUserDetails), (_user) => {
        return (
            {
                label: _user.username,
                value: _user.username

            }
        )
    })

    const handleRequest = () => {
        sendMessageForRequest({
            newMessageAmount: parseFloat(amount),
            threadUserName: selectedUser
        })
            .then(console.log)
    }


    console.log("selectedUser", selectedUser)

    if (userDetails) {
        return (
            <Row>
                <div className="app">
                    <AppHeader onBack={() => navigate('/')} />
                    <Row>
                        <Col offset={1}>
                            <Row>
                                <Col span={24}>
                                    <AutoComplete
                                        placeholder={"Search for users"}
                                        filterOption
                                        onSelect={setSelectedUser}
                                        // onSearch={handleSearch}
                                        style={{ width: 200 }}
                                        options={userOptions}
                                    />


                                </Col>
                                <Col span={24}>
                                    <InputNumber
                                        placeholder={"Enter amount"}
                                        style={{ width: 200 }}
                                        onChange={setAmount}
                                    />
                                </Col>
                                <Col span={24}>
                                    <Button onClick={handleRequest}>
                                        Send Request
                                    </Button>

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Row>
        )
    }

};

export default NewRequestPage
