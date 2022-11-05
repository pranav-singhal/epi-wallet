import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
const NOTIFICATION_CHANNEL = '0xBA36124E8af635d9d32C4cC49802cacade133a5F';
const NOTIFICATION_CHANNEL_PVT_KEY = '889fa6ff54d4190253a6b1c59bd08e3dc03485478dd93b2fff8e4600bde06b42';
const channelSigner = new ethers.Wallet(NOTIFICATION_CHANNEL_PVT_KEY);
const notificationIdentifier = 'wallet-notif'
export const sendNotification = (type, opts) => {
    // type(defined from receiver's perspective): 
    // - request opts: {amount: float, recipient: address, from: address}
    // - received opts: {amount: float, recipient: address, from: address}

    return PushAPI?.payloads?.sendNotification({
        signer: channelSigner,
        type: 3, // target
        identityType: 2, // direct payload
        notification: {
          title: type === 'request'? 'Someone has asked you for some coin': 'Someone has sent you some coin',
          body: 'testing'
        },
        payload: {
            title: notificationIdentifier,
            cta: 'testing',
            img: 'testing',
            body: JSON.stringify(
                {
                    type,
                    amount: opts?.amount,
                    channel: NOTIFICATION_CHANNEL,
                    from: opts?.from,
                    createdAt: Date.now()
                }
            )
        

        },
        recipients: `eip155:5:${opts?.recipient}`, // recipient address
        channel: `eip155:5:${NOTIFICATION_CHANNEL}`, // your channel address
        env: 'staging'
      });

}

export const getNotifications = (public_key) => {
    return PushAPI.user.getFeeds({
        user: `eip155:5:${public_key}`, // user address in CAIP
        env: 'staging'
      })
      .then(notifications => {
          if (Array.isArray(notifications)) {
              const filterteredNotifications  = notifications.filter(_notification => {
                  return _notification?.title === notificationIdentifier;
              })

              return filterteredNotifications;
          }
          return [];
      })
      .then(filteredNotifications => {


        if (!Array.isArray(filteredNotifications) || filteredNotifications.length ===0 )  {
            return []
        }
          // get latest notification timestamp from localstorage - lastSeen
          const lastSeen = parseInt(localStorage.getItem('lastSeen') || 0);
          const unreadNotifications = filteredNotifications.filter(_notification => {
              const message = JSON.parse(_notification.message);
              return message.createdAt &&  (message.createdAt > lastSeen);
          })

          const sortedUnreadNotifications =  unreadNotifications.sort((_notificationA, _notificationB) => {
              return _notificationA?.createdAt > _notificationB.createdAt
          })

          if (sortedUnreadNotifications?.length && sortedUnreadNotifications?.length > 0) {
            localStorage.setItem('lastSeen', JSON.parse(sortedUnreadNotifications[0]?.message)?.createdAt)
          }
          

          
          return unreadNotifications;



          // get all notifications whose createdAt > lastSeen - newNotifs
          // arrage newNotifs by timestamp
          // get new lastSeen - newLastSeen
          // update lastSeen = newLastSeen
          // 


      })
}