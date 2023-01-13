/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 26/10/22
 */
import Web3 from "web3";
import _ from 'lodash';
import * as ethers from "ethers";
import {BASE_URL, getCurrentUser} from "../api";
export const INFURA_API_KEY = '464843df892c4c7f8fb28e076da669f9';
export const INFURA_URL = 'https://sepolia.infura.io/v3/464843df892c4c7f8fb28e076da669f9';
export const BLOCK_EXPLORER_BASE_URL = 'https://sepolia.etherscan.io'

export const PASSWORD = 'crypto_project_x';
export const WALLET_LOCAL_STORAGE_KEY = 'web3js_wallet';
//114addfd125a71f033c64f1eeb3b59ca468481233087aaca1b94ad09e54d71d4
export class Web3Helper {
  web3 = null;

  constructor (url = INFURA_URL) {
    this.web3 = new Web3(url);

    this.web3.eth.accounts.wallet.load(PASSWORD, WALLET_LOCAL_STORAGE_KEY)
  }

  async getAccountBalance (address, unit = 'wei') {
    const balanceInWei = await this?.web3?.eth?.getBalance(address);

    if (unit === 'eth') {
      return this.web3?.utils?.fromWei(balanceInWei)
    }

    return balanceInWei;
  }

  _trimPrivateKey (privateKey) {
    return _.join(_.split(privateKey, ' '), '')
  }

  getAccountAddress () {
    return _.get(this.web3, 'eth.accounts.wallet[0].address');
  }

  addNewWallet (pvtKey, password) {
    try {
      this.web3.eth.accounts.wallet.add(this._trimPrivateKey(pvtKey));
      this.web3.eth.accounts.wallet.save(password, WALLET_LOCAL_STORAGE_KEY);
      return true;
    } catch (e) {
      console.error(e);
      return false
    }

  }

  clearAllWallets () {
    this.web3.eth.accounts.wallet.clear();
    localStorage.removeItem(WALLET_LOCAL_STORAGE_KEY);
  }

  isAccountLoaded () {
    const address = _.get(this.web3, 'eth.accounts.wallet[0].address');

    return address && address.length > 0;
  }

  getWalletObjectFromPrivateKey (pvtKey) {
    try {
      return this.web3.eth.accounts.privateKeyToAccount(this._trimPrivateKey(pvtKey))
    } catch (e) {
      return false;
    }

  }

  createNewWalletWithEntropy () {
    try {
      return this.web3.eth.accounts.create()
    }
    catch (e) {
      return false
    }
  }

  getGasPriceInEth () {
    return this.web3.eth.getGasPrice()
      .then((priceInWei) => {
        return this.web3.utils.fromWei(priceInWei, 'ether');
      })
  }

  getEthersWallet () {
    const privateKey = _.get(this.web3, 'eth.accounts.wallet[0].privateKey');

    if (!privateKey) {
      return null;
    }

    return new ethers.Wallet(privateKey);
  }

  sendTransaction (to, value, gas, transactionId= null, qrId = null) {
    return new Promise((resolve, reject) => {
      this.web3.eth.sendTransaction({
        from: this.getAccountAddress(),
        to: this.web3.utils.toChecksumAddress(to.address),
        value: this.web3.utils.toWei(`${value}`),
        gas
      })
        .on('transactionHash',  (hash) => {
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          (() => {
            if (transactionId) {
              return fetch(`${BASE_URL}/transaction/${transactionId}`, {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify({
                  status: "pending",
                  id: transactionId,
                  hash: hash
                })
              })
            }

            return fetch(`${BASE_URL}/message`, {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify({
                "type": "recieved",
                "sender": getCurrentUser(),
                "recipient": to.name,
                "txDetails": {
                  amount: value,
                  hash: hash,
                  qrCodeId: qrId
                },
                meta: {
                  publicKey: this.getAccountAddress()
                }
              }),
            })
          })()
            .then(() => resolve());
        })
        .on('error', (err) => {
          console.error(err);
          reject(err);
        })
    })
  }

  checkIfMined (hash) {
    return this.web3.eth.getTransactionReceipt(hash)
      .then((receipt) => {
        return receipt;


      })
  }
}
export default new Web3Helper();


