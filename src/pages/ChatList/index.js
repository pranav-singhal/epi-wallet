/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import { useEffect, useState } from "react";
import { Avatar, Badge, Col, Row } from "antd";
import _ from "lodash";
import { ArrowRightOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../api";

const userDetails = {
  pranav: {
    name: 'pranav',
    address: '0xD7F1a592874bbe5d14c3f024c08b630e6De5A11B',
    avatarLink: 'https://picsum.photos/id/1025/200/300.jpg'
  },
  arvind: {
    name: 'arvind',
    address: '0xD4ea698DfCdf0ADDeAAe77A2d6584f822738cf66',
    avatarLink: 'https://picsum.photos/id/237/200/300.jpg'
  }
}

const ChatList = (props) => {
  const [threadUsers, setThreadUsers] = useState([]);

  useEffect(() => {
    // TODO - add new message count - not sure about how to do it
    fetch(`${BASE_URL}/threads?sender=${localStorage.getItem('current_user')}`, {
      headers: {
        'Content-Type': 'application/json'
      }
      
    })
    .then(res => res.json())
    .then(res => {
      setThreadUsers(res?.threads || []);
    });
  }, [])

  return (
    <div className="chat-list">
      <Row>
        {_.map(threadUsers, (threadUserName) => {
          const threadUser = userDetails[threadUserName];
          return (
            <Col span={24} key={threadUser.address}>
            <div
              className="chat-list-row"
              onClick={() => {
                props.openChat(threadUser);
              }}
            >
              {/* {chatItem.numNewMessages > 0 ? (
                <Badge count={chatItem.numNewMessages}>
                  <Avatar src={chatItem.avatarLink} />
                </Badge>
              ) : ( */}
              <Avatar src={threadUser.avatarLink} />
              {/* )} */}

              <div className="chat-list-row__content">
                <div className="chat-list-row__content-name">
                  {threadUser.name}
                </div>
                <div className="chat-list-row__content-address">
                  {threadUser.address}
                </div>
              </div>
              <div className="chat-list-row__icon">
                <ArrowRightOutlined />
              </div>
            </div>
          </Col>
          )
        })}
      </Row>
    </div>
  );
};

export default ChatList;
