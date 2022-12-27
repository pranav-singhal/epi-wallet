import { Button, Col, InputNumber, Row } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserDetails from "../../hooks/useUserDetails";
import AppHeader from "../AppHeader";
import AutoCompleteSearchForUsers from "../AutoCompleteSearchForUsers";

const NewSendMoneyPage = () => {
    const [selectedUser, setSelectedUser] = useState()
    const [amount, setAmount] = useState();
    const navigate = useNavigate();
    const handleSendMoney = () => {
        navigate(`/transaction?to=${selectedUser}&amount=${amount}`)
    }

    const [userDetails] = useUserDetails();
    if (userDetails) {
        return (
            <Row>
                <div className="app">
                    <AppHeader onBack={() => navigate('/')} />
                    <Row>
                        <Col offset={1}>
                            <Row>
                                <Col span={24}>
                                    <AutoCompleteSearchForUsers
                                    onSelect={setSelectedUser}
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
                                    <Button onClick={handleSendMoney}>
                                        Send
                                    </Button>

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Row>
        )
    }
}

export default NewSendMoneyPage;