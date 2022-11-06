/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 24/10/22
 */
import React, {useEffect, useState} from 'react'
import {Avatar, Button, Descriptions, Spin, Space} from "antd";
import Web3 from "../../helpers/Web3";
import _ from "lodash";

const Account = (props) => {
  const {name, address, avatar} = props;

  return (
    <div
      className="user-account"
    >
      <Avatar src={avatar} />
      <div className="user-account__content">
        <div className="user-account__content-name">
          {name}
        </div>
        <div className="user-account__content-address">
          {address}
        </div>
      </div>
    </div>
  )
}

const PRECISION = 5;

const TransactionPopup = (props) => {
  const gas = 30000;
  const [isLoading, setIsLoading] = useState(true);
  const [gasPrice, setGasPrice] = useState(0);
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      Web3.getGasPriceInEth()
        .then((price) => {
          setGasPrice(price);

          setIsLoading(false);
        })
    }, 1500)
  })

  const { to, amount, transactionId, qrId } = props.transaction;
  const totalGasAmount = gas * gasPrice;

  const currentUser = localStorage.getItem('current_user');
  const from = _.get(props, ['userDetails', currentUser]);

  if (isLoading) {
    return (
      <div className='fullpage-loader'>
        <Space size="middle">
          <Spin size='large'/>
        </Space>
      </div>
    )
  }

  return (
    <div className='transaction-popup'>
      <Descriptions
        bordered
        column={1}
        contentStyle={{
          height: '80px'
        }}
        labelStyle={{
          height: '80px',
          fontSize: '20px'
        }}
      >
        <Descriptions.Item label="From">
          <Account {...from} />
        </Descriptions.Item>
        <Descriptions.Item label="To">
          <Account {...to} />
        </Descriptions.Item>
        <Descriptions.Item label='Gas'>
          <div className='eth-amounts'>
            <span>{totalGasAmount.toPrecision(PRECISION)}</span>
            <span>ETH</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label='Value' contentStyle={{fontSize: '20px'}}>
          <div className='eth-amounts'>
            <span>{amount.toPrecision(PRECISION)}</span>
            <span>ETH</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label='Total' contentStyle={{fontSize: '20px'}}>
          <div className='eth-amounts'>
            <span>{(amount + totalGasAmount).toPrecision(PRECISION)}</span>
            <span>ETH</span>
          </div>
        </Descriptions.Item>
      </Descriptions>
      <div className='buttons'>
        <Button
          type="primary"
          size='large'
          shape='round'
          loading={isTransactionProcessing}
          onClick={() => {
            setIsTransactionProcessing(true)
            Web3.sendTransaction(to, amount, gas, transactionId, qrId)
              .then(() => props.onDone())
          }}
        >
          Confirm
        </Button>
        <Button
          type="default"
          size='large'
          shape='round'
          onClick={props.onDone}
        >
          Reject
        </Button>
      </div>
    </div>
  )
}

export default TransactionPopup;
