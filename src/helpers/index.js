import * as PushAPI from "@pushprotocol/restapi";
const notificationIdentifier = 'wallet-notif'

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
