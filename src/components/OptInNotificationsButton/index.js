import { Button } from "antd";
import React from "react";
import * as PushAPI from "@pushprotocol/restapi";
import useIsSubscribed from "../../hooks/useIsSubscribed";
import Web3 from "../../helpers/Web3";

const NOTIFICATION_CHANNEL = '0xBA36124E8af635d9d32C4cC49802cacade133a5F';
const signer = Web3.getEthersWallet();
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
