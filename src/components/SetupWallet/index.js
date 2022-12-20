import React from "react";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";


const SetupWallet = () => {
    console.log("testing 321")
    const navigate = useNavigate()
    return (
        <div className='import-wallet'>
            <Button onClick={() => navigate("/create")} >
                Create New wallet
            </Button>

            <Button onClick={() => navigate("/import")} >
                Import Wallet
            </Button>
        </div>
    )
}

export default SetupWallet;
