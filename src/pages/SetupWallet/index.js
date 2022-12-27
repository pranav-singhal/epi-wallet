import React, { useState } from "react";
import {Button, Typography} from "antd";
import classnames from "classnames";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { ImportOutlined, PlusSquareOutlined } from "@ant-design/icons";
import SetupWalletLayout from "../../components/SetupWalletLayout";

const { Title } = Typography;
const IMPORT_OPTION = "import";
const CREATE_NEW_WALLET = "create_new_wallet";

const SetupWallet = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  return (
    <SetupWalletLayout>
      <div className="wallet-options-container">
        <div
          className={classnames("wallet-option", {
            "selected-option": selectedOption === IMPORT_OPTION,
          })}
          onClick={() => setSelectedOption(IMPORT_OPTION)}
        >
          <ImportOutlined />
          <Title level={3} type="secondary">
            Import using Private Key
          </Title>
        </div>
        <div
          className={classnames("wallet-option", {
            "selected-option": selectedOption === CREATE_NEW_WALLET,
          })}
          onClick={() => setSelectedOption(CREATE_NEW_WALLET)}
        >
          <PlusSquareOutlined />
          <Title level={3} type="secondary">
            Create a New Wallet
          </Title>
        </div>
      </div>
      <Button
        className="setup-wallet-submit"
        size="large"
        type="primary"
        disabled={_.isEmpty(selectedOption)}
        onClick={() => {
          if (_.isEmpty(selectedOption)) {
            return;
          }

          if (selectedOption === IMPORT_OPTION) {
            navigate("/wallet/import");
          }

          if (selectedOption === CREATE_NEW_WALLET) {
            navigate("/wallet/create");
          }
        }}
      >
        Next
      </Button>
    </SetupWalletLayout>
  );
};

export default SetupWallet;
