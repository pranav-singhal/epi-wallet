import * as PushAPI from "@pushprotocol/restapi";
import {NOTIFICATION_CHANNEL} from "../components/OptInNotificationsButton";
import { isSafariIos, isWebView, subscribeToWebNotifications } from "../helpers";

export const BASE_URL = 'https://wallet-api.consolelabs.in';
// export const BASE_URL = 'http://localhost:1337';

export const getCurrentUser = () => {
  return localStorage.getItem('current_user');
}

const getHeaders = () => {
  const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          return myHeaders;
}

export const fetchMessages = (threadUser) => {
  return fetch(`${BASE_URL}/messages?sender=${getCurrentUser()}&recipient=${threadUser}`)
    .then(res => res.json())
};

export const getAllUsers = () => {
  return fetch(`${BASE_URL}/users`)
      .then(res => res.json());
}

export const createNewUser = ({username, address}) => {
  return fetch(`${BASE_URL}/user`, {
    method: 'POST',
    body: JSON.stringify({
      username,
      address,
      avatarLink: `https://picsum.photos/id/${Math.ceil(Math.random() *1000)}/200/300.jpg`
    })
  })
  .then(res => res.json());
}

export const createUserSubscription = ({username, subscription}) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  return fetch(`${BASE_URL}/user/subscription`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      username,
      subscription
    })
  })
  .then(res => res.json());
}

export const getUserSubscription = (username) => {
  return fetch(`${BASE_URL}/user/${username}/subscription`)
  .then(res => res.json());
}

export const subscribeToNotifications = (signer) => {
  const currentUsername = localStorage.getItem('current_user');
  if (currentUsername) {
    
    const public_key = signer?.address;
    
    return (() => {
      if (isWebView() || isSafariIos()) {
        return Promise.resolve()
      }

      return subscribeToWebNotifications()
    .then(subscriptionObject => {
      console.log("subscriptionObject: ", subscriptionObject);
      if (subscriptionObject) {
        return createUserSubscription({
          username: currentUsername,
          subscription: JSON.stringify(subscriptionObject)
        })
      }
      return Promise.resolve();
    })
    })()
    .then(subscriptionObject => {
      return PushAPI.channels.subscribe({
        signer,
        channelAddress: `eip155:5:${NOTIFICATION_CHANNEL}`, // channel address in CAIP
        userAddress: `eip155:5:${public_key}`, // user address in CAIP
        onSuccess: () => {
          console.log('opted in!');
          return subscriptionObject;
          // subscribeToWebNotifications()
        },
        onError: () => {
          console.error('opt in error');
        },
        env: 'staging'
      })
    })
  } else {
    return Promise.reject();
  }
  
}

export const sendMessageForRequest = ({newMessageAmount, threadUserName}) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  return fetch(`${BASE_URL}/message`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      "type": "request",
      "sender": getCurrentUser(),
      "recipient": threadUserName,
      "txDetails": {
        "amount": newMessageAmount
      }
    }),
  })
      .then(response => response.json())
}

export const updateTransactionStatus = ({txStatus, id}) => {
  return fetch(`${BASE_URL}/transaction/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      status: txStatus,
      id,
    })
  })
}