import Web3 from "../helpers/Web3";

export const BASE_URL = 'https://wallet-api-a.herokuapp.com';

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

export const userDetails = {
  pranav: {
    name: 'pranav',
    address: '0xD7F1a592874bbe5d14c3f024c08b630e6De5A11B',
    avatarLink: 'https://picsum.photos/id/1025/200/300.jpg'
  },
  arvind: {
    name: 'arvind',
    address: '0xE4928EEA34C76D351D4Ed58266DEbfA7A4b42519',
    avatarLink: 'https://picsum.photos/id/237/200/300.jpg'
  },
  vendor: {
    name: 'vendor',
    address: '0xD4ea698DfCdf0ADDeAAe77A2d6584f822738cf67',
    avatarLink: 'https://picsum.photos/id/238/200/300.jpg'
  }
}
