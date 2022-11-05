import * as PushAPI from "@pushprotocol/restapi";
const notificationIdentifier = 'wallet-notif'

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
    })
}
