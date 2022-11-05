/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 17/04/22
 */
import { useState } from "react";
import { Avatar, Badge, Col, Row } from "antd";
import _ from "lodash";
import { ArrowRightOutlined } from "@ant-design/icons";

const ROWS = [
  {
    name: "Alice",
    address: "0xE4928EEA34C76D351D4Ed58266DEbfA7A4b42519",
    avatarLink: "https://www.w3schools.com/howto/img_avatar.png",
    numNewMessages: 0,
  },
  {
    name: "Bob",
    address: "0xbf8C34F0f19e7a0fBa497372BFEca821C145B24D",
    avatarLink: "https://www.w3schools.com/howto/img_avatar.png",
    numNewMessages: 1,
  },
];

const ChatList = (props) => {
  const [chatRows, setChatRows] = useState(ROWS);

  return (
    <div className="chat-list">
      <Row>
        {_.map(chatRows, (chatItem) => (
          <Col span={24} key={chatItem.address}>
            <div
              className="chat-list-row"
              onClick={() => {
                props.openChat(chatItem);
              }}
            >
              {chatItem.numNewMessages > 0 ? (
                <Badge count={chatItem.numNewMessages}>
                  <Avatar src={chatItem.avatarLink} />
                </Badge>
              ) : (
                <Avatar src={chatItem.avatarLink} />
              )}

              <div className="chat-list-row__content">
                <div className="chat-list-row__content-name">
                  {chatItem.name}
                </div>
                <div className="chat-list-row__content-address">
                  {chatItem.address}
                </div>
              </div>
              <div className="chat-list-row__icon">
                <ArrowRightOutlined />
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ChatList;
