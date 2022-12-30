import * as PushAPI from "@pushprotocol/restapi";
const notificationIdentifier = 'wallet-notif'
const VAPID_PUBLIC_KEY = 'BLqgt5ScjMAkgorznQWbd0pfbgb7i-Ej0vBC1m8CqXa1y6jczLoK_jwKjGbfa7o8i_6hykUStj7_Ha7ysjcSKx8';

export const getNotifications = (public_key) => {
    return PushAPI.user.getFeeds({
      user: `eip155:5:${public_key}`,
      env: 'staging'
    })
    .then(notifications => {
      if (Array.isArray(notifications)) {
        const filteredNotifications  = notifications.filter(_notification => {
          return _notification?.title === notificationIdentifier;
        })
        return filteredNotifications;
      }
      return [];
    })
    .then(filteredNotifications => {
      if (!Array.isArray(filteredNotifications) || filteredNotifications.length ===0 )  {
        return []
      }

      // get the latest notification timestamp from localstorage - lastSeen
      const lastSeen = parseInt(localStorage.getItem('lastSeen') || 0);
      const unreadNotifications = filteredNotifications.filter(_notification => {
        const message = JSON.parse(_notification.message);
        return message.createdAt &&  (message.createdAt > lastSeen);
      })

      const sortedUnreadNotifications =  unreadNotifications.sort((_notificationA, _notificationB) => {
        return _notificationA?.createdAt > _notificationB?.createdAt
      })

      if (sortedUnreadNotifications?.length && sortedUnreadNotifications?.length > 0) {
        localStorage.setItem('lastSeen', JSON.parse(sortedUnreadNotifications[0]?.message)?.createdAt)
      }

      return sortedUnreadNotifications;
    })
}

export const toTitleCase = (string) => {
  if (typeof string !== 'string') {
    return string;
  }

  return string.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase());
}

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const registerServiceWorker = () => {
  return navigator.serviceWorker
      .register('./service-worker.js')
      .then(registration => {

        // return registration
          const subscriptionOptions = {
            userVisibleOnly: true,
              applicationServerKey: VAPID_PUBLIC_KEY
          }

          return registration.pushManager.subscribe(subscriptionOptions)
      })
      .then((pushSubscription) => {
          console.log("Subscribed to notifications: ", JSON.stringify(pushSubscription))
          return pushSubscription;
      })
      .catch(err => {
        console.error("unable to register service worker: ", err)
      })
}
