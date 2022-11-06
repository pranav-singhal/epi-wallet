import Web3 from "../helpers/Web3";
import * as PushAPI from "@pushprotocol/restapi";
import {NOTIFICATION_CHANNEL} from "../components/OptInNotificationsButton";

export const BASE_URL = 'https://wallet-api.consolelabs.in';

export const getCurrentUser = () => {
  return localStorage.getItem('current_user');
}

export const getCurrentUserPublicKey = () => {
  return Web3.getAccountAddress();
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

export const subscribeToNotifications = () => {
  const signer = Web3.getEthersWallet();
  const public_key = signer?.address;
  return PushAPI.channels.subscribe({
    signer,
    channelAddress: `eip155:5:${NOTIFICATION_CHANNEL}`, // channel address in CAIP
    userAddress: `eip155:5:${public_key}`, // user address in CAIP
    onSuccess: () => {
      console.log('opted in!');
    },
    onError: () => {
      console.error('opt in error');
    },
    env: 'staging'
  })
}
