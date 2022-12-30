self.addEventListener('push', (event) => {
    const promiseChain = self.registration.showNotification("From EPI ", {
        body: "Arvind has requested money from you"
    })
    console.log('promise chain: ', promiseChain);
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
