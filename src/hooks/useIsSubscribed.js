import * as PushAPI from "@pushprotocol/restapi";

import { useEffect, useState } from "react";
const NOTIFICATION_CHANNEL = '0xBA36124E8af635d9d32C4cC49802cacade133a5F';

const useIsSubscribed = (public_key) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        
        PushAPI.user.getSubscriptions({
            user: `eip155:5:${public_key}`, // user address in CAIP
            env: 'staging'
          })
          .then(res => {
              const channelArray = res.map(item => item?.channel);
              if (Array.isArray(channelArray) && channelArray.includes(NOTIFICATION_CHANNEL)) {
                  setIsSubscribed(true);
              }
          })
          .finally(() => {
              setIsLoading(false);
          })

    }, [public_key])


    return [isLoading, isSubscribed, setIsSubscribed];
};

export default useIsSubscribed;