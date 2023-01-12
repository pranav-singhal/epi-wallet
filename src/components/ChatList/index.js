import { ArrowRightOutlined } from "@ant-design/icons";
import { Avatar, Col, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api";
import useUserDetails from "../../hooks/useUserDetails";
import AttachBadge from "../../pages/AttachBadge";
import _ from "lodash";
import { toTitleCase } from "../../helpers";
import "./style.scss";

const ChatList = () => {
  const [threadUsers, setThreadUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [userDetails] = useUserDetails();

  useEffect(() => {
    // TODO - add new message count - not sure about how to do it
    const fetchPromise = fetch(
      `${BASE_URL}/threads?sender=${localStorage.getItem("current_user")}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setThreadUsers(_.compact(res?.threads) || []);
      });

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve(), 1500);
    });

    Promise.all([fetchPromise, timeoutPromise]).then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="chat-list-loading">
        <Skeleton active avatar paragraph={{ rows: 1 }} />
        <Skeleton active avatar paragraph={{ rows: 1 }} />
      </div>
    );
  }

  if (userDetails) {
    return (
      <div className="chat-list">
        <Row>
          {_.map(threadUsers, (threadUserName) => {
            const threadUser = _.get(userDetails, [threadUserName]);
            if (threadUser) {
              return (
                <Col span={24} key={threadUserName}>
                  <AttachBadge
                    showBadge={
                      threadUser?.user_type && threadUser.user_type === "vendor"
                    }
                  >
                    <div
                      className="chat-list-row"
                      onClick={() => {
                        navigate(`/chat?to=${threadUser.username}`);
                      }}
                    >
                      <Avatar src={threadUser?.avatar} />
                      <div className="chat-list-row__content">
                        <div className="chat-list-row__content-name">
                          {toTitleCase(threadUser?.name || threadUser?.username|| 'not found')}
                        </div>
                        <div className="chat-list-row__content-address">
                          {threadUser?.address}
                        </div>
                      </div>
                      <div className="chat-list-row__icon">
                        <ArrowRightOutlined />
                      </div>
                    </div>
                  </AttachBadge>
                </Col>
              );
            }
          })}
        </Row>
      </div>
    );
  }
};

export default ChatList;
