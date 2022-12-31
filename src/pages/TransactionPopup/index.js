/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 24/10/22
 */
import React, {useEffect, useState} from 'react'
import { Avatar, Button, Descriptions, Spin, Space, Row, Col } from "antd";
import { Web3Helper } from "../../helpers/Web3";
import _ from "lodash";
import {toTitleCase} from "../../helpers";
import useUserDetails from "../../hooks/useUserDetails";
import useQuery from "../../hooks/useQuery";
import {useNavigate} from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout";
import FullPageLoader from "../../components/FullPageLoader";
import useChainContext from '../../hooks/useChainContext';

const Account = (props) => {
  const {name, address, avatar} = props;
  return (
    <Row
      className="user-account"
    >
      <Col span={4}>
        <Avatar src={avatar} />
      </Col>
      <Col span={20}>
        <div className="user-account__content">
          <div className="user-account__content-name">
            {toTitleCase(name)}
          </div>
          <div className="user-account__content-address">
            {address}
          </div>
        </div>
      </Col>
    </Row>
  )
}

const PRECISION = 5;

const TransactionPopup = (props) => {
  const [rpcUrl] = useChainContext();
  const Web3 = new Web3Helper(rpcUrl);
  const gas = 30000;
  const [isLoading, setIsLoading] = useState(true);
  const [gasPrice, setGasPrice] = useState(0);
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);
  const [userDetails] = useUserDetails();
  const query = useQuery();
  let to = query.get('to');
  to = _.get(userDetails, [to]);
  const amount = parseFloat(query.get('amount'));
  const transactionId = query.get('transactionId')
  const qrId  = query.get('qrId');
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      Web3.getGasPriceInEth()
        .then((price) => {
          setGasPrice(price);

          setIsLoading(false);
        })
    }, 1500)
  })

  const totalGasAmount = gas * gasPrice;

  const currentUser = localStorage.getItem('current_user');
  const from = _.get(userDetails, [currentUser]);

  if (isLoading) {
    return <FullPageLoader removeMessage />;
  }

  return (
    <MainLayout
      removeExtraIcons
      showAppName={false}
      onBackClick={() => navigate(-1)}
      headerTitle="Confirm Transaction"
    >
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
            onClick={() => Web3.sendTransaction(to, amount, gas, transactionId, qrId)
              .then(() => navigate(`/chat?to=${to?.username}`))
            }
          >
            Confirm
          </Button>
          <Button
            type="default"
            size='large'
            shape='round'
            onClick={() => navigate(`/chat?to=${to?.username}`)}
          >
            Reject
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

export default TransactionPopup;
