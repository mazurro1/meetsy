import { util } from "./util";
("use strict");

declare let self: ServiceWorkerGlobalScope;

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
//
// self.__WB_DISABLE_DEV_LOGS = true

util();

self.addEventListener("message", async (event: any) => {
  if (event.data && event.data.action === "CACHE_NEW_ROUTE") {
    caches.open("others").then((cache) =>
      cache.match(event.source.url).then((res) => {
        if (res === undefined) {
          return cache.add(event.source.url);
        }
      })
    );
  }
});

self.addEventListener("push", (event: any) => {
  const data = JSON.parse(event?.data.text() || "{}");
  event?.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/icons/android-chrome-192x192.png",
    })
  );
});

self.addEventListener("notificationclick", (event: any) => {
  event?.notification.close();
  event?.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList: any) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return self.clients.openWindow("/");
      })
  );
});
