/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 01/01/23
 */
import PropTypes from "prop-types";
import _ from "lodash";
import { Avatar, Button, Input, Select } from "antd";
import styled from "styled-components";
import React, { useState } from "react";

const { Option } = Select;

const ReceiverOptionContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const getTitleByTransactionType = (type) => {
    switch (type) {
        case 'send':
            return "Send to:";
        case 'request':
            return "Request from";
        default:
            return 'Select User';
    }
}

const TransactionDetails = (props) => {
  const [amount, setAmount] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="transaction-details">
      <div className="transaction-details-form-item">
          {
              getTitleByTransactionType(props.type)
          }
        <Select
          showSearch
          placeholder="Search via Username"
          placement="bottomRight"
          value={selectedUser}
          onSelect={(_selectedUsername) => setSelectedUser(_selectedUsername)}
        >
          {_.map(props.users, (user) => (
            <Option
              className="receiver-option"
              value={user.username}
              key={user.username}
            >
              <ReceiverOptionContainer>
                <Avatar src={user.avatar} size="small" />
                <div>{user.username}</div>
              </ReceiverOptionContainer>
            </Option>
          ))}
        </Select>
      </div>
      <div className="transaction-details-form-item">
        <div>Amount:</div>
        <Input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e?.target?.value);
          }}
        />
      </div>

      <div className="transaction-details-action">
        <Button
          onClick={() => {
            props.onNext(parseFloat(amount), selectedUser);
          }}
          type="primary"
          size="large"
          disabled={_.isEmpty(selectedUser) || !amount || amount <= 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

TransactionDetails.propTypes = {
  onNext: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    })
  ),
};

TransactionDetails.defaultProps = {
  onNext: _.noop,
};

export default TransactionDetails;
