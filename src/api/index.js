import * as ethers from "ethers";
export const BASE_URL = 'http://localhost:1337';
// const signer = new ethers.Wallet(NOTIFICATION_CONSUMER_1_PVT_KET);
// const public_key = signer?.address;
// console.log('pvt key:', localStorage.getItem('pvt_key'), public_key);

export const getCurrentUser = () => {
    return localStorage.getItem('current_user');
}

export const getCurrentUserPublicKey = () => {
    const pvtKey = localStorage.getItem('pvt_key');
    const signer = new ethers.Wallet(pvtKey);
    return signer?.address;
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
    address: '0xD4ea698DfCdf0ADDeAAe77A2d6584f822738cf66',
    avatarLink: 'https://picsum.photos/id/237/200/300.jpg'
}
}
  