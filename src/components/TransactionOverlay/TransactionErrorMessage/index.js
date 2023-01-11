import { Space, Typography } from "antd";
import React from "react";

const {Text} = Typography;
const TransactionErrorMesage = ({message}) => (
    <>
    <Space direction="horizontal" style={{width: '100%', justifyContent: 'center'}} >
        <Text type="danger" style={{textTransform: 'capitalize'}}>{message}</Text>
        </Space>
    </>
)

export default TransactionErrorMesage;