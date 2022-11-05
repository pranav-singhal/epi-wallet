import { Button } from "antd";
import React from "react";
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import useIsSubscribed from "../../hooks/useIsSubscribed";

const NOTIFICATION_CONSUMER_1_PVT_KEY = localStorage.getItem('pvt_key');
const NOTIFICATION_CHANNEL = '0xBA36124E8af635d9d32C4cC49802cacade133a5F';
const signer = new ethers.Wallet(NOTIFICATION_CONSUMER_1_PVT_KEY);
const public_key = signer?.address;
const OptInNotificationsButton = () => {
    

    const [isLoading, isSubscribed, setIsSubscribed] = useIsSubscribed(public_key);

    const handleOptIn = () => {
        PushAPI.channels.subscribe({
            signer,
            channelAddress: `eip155:5:${NOTIFICATION_CHANNEL}`, // channel address in CAIP
            userAddress: `eip155:5:${public_key}`, // user address in CAIP
            onSuccess: () => {
             setIsSubscribed(true);
            },
            onError: () => {
              console.error('opt in error');
            },
            env: 'staging'
          })
    }

    const handleOptOut = () => {
        PushAPI.channels.unsubscribe({
            signer,
            channelAddress: `eip155:5:${NOTIFICATION_CHANNEL}`, // channel address in CAIP
            userAddress: `eip155:5:${public_key}`, // user address in CAIP
            onSuccess: () => {
             setIsSubscribed(false);
            },
            onError: () => {
              console.error('opt out error');
            },
            env: 'staging'
          })
    }

    if (isLoading) {
        return 'loading';
    }

    if (!isSubscribed) {
        return (
            <Button onClick={handleOptIn} >
                Opt in
            </Button>  
        )
    }
    
    return (
        <Button onClick={handleOptOut} >
                Opt out
            </Button>  
    )
}

export default OptInNotificationsButton;
