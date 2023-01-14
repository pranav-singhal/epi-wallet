import { CopyOutlined } from "@ant-design/icons";
import { message } from "antd";
import React from "react";

const CopyWalletAddress = ({currentUserDetails}) => {
    return (
        <CopyOutlined onClick={() => {
            if (window.webkit) {
              window.webkit.messageHandlers.observer.postMessage(`ethereum:${currentUserDetails.address}`);
            }
            navigator?.clipboard?.writeText(currentUserDetails.address)    
            message.success({
                content: (
                  <span>
                    Copied
                  </span>
                ),
                className: 'message-notification'
              })
          }}
        />
    )
}


export default CopyWalletAddress;