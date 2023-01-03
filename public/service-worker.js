self.addEventListener('activate', function(event) {
    console.log("Activated")
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
          console.log("cache names:", cacheNames)
        return Promise.all(
          cacheNames.map(function(cacheName) {
              console.log("cache keys", cacheName)
            return caches.delete(cacheName);
          })
        );
      })
    );
  });

const getNotificationString = (notificationData) => {

    if (notificationData?.type === 'request') {
        return `${notificationData?.from || 'Someone'} has requested ${notificationData.amount} ETH from you`
    }

    if (notificationData?.type === 'recieved') {
        return `${notificationData?.from || 'Someone'} has sent you ${notificationData.amount} ETH`
    }
}

self.addEventListener('push', (event) => {

    const promiseChain = self.registration.showNotification("From EPI ", {
        body: getNotificationString(event.data.json())
    })

    event.waitUntil(promiseChain);
})

self.addEventListener('notificationclick', function(event) {
    let url = ['http://localhost:3000/', 'https://wallet.consolelabs.in'];
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({type: 'all', includeUncontrolled: true}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                console.log("client url: ", client.url);
                // If so, just focus it.
                if (url.includes(client.url) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
