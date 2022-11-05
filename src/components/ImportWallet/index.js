import React from 'react';
import {Button} from "antd";

const ImportWallet = ({ setOpenPage }) => {
    return (
        <Button onClick={setOpenPage}>
            Import Wallet
        </Button>
    )
};

export default ImportWallet;