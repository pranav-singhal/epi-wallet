import React from 'react';
import {Button, PageHeader} from "antd";
import {QrcodeOutlined} from "@ant-design/icons";
import OptInNotificationsButton from "../OptInNotificationsButton";
import {useNavigate} from "react-router-dom";

const AppHeader = ({
    onBack = null,
    title,
    subtitle
}) => {
    const navigate = useNavigate()
    return <PageHeader
        className="site-page-header"
        avatar={{ src: "https://i.imgur.com/ZAE8cku.png"}}
        onBack={onBack}
        title={title}
        subTitle={subtitle}
        extra={[
            <Button
                key="button"
                type="dashed"
                shape="circle"
                icon={<QrcodeOutlined />}
                size="large"
                onClick={() => navigate("/scan")}
            />,
            <OptInNotificationsButton key="notifications" />,
        ]}
    />
}

export default AppHeader
