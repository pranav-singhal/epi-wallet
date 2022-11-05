/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 26/10/22
 */
import Web3 from "web3";
import * as ethers from "ethers";
import {BASE_URL, getCurrentUser} from "../api";

const PASSWORD = 'crypto_project_x'

class Web3Helper {
  web3 = null;

  constructor () {
    this.web3 = new Web3('https://sepolia.infura.io/v3/464843df892c4c7f8fb28e076da669f9');

    this.web3.eth.accounts.wallet.load(PASSWORD)

    // uncomment to setup your wallet in local storage
    // this.web3.eth.accounts.wallet.add('92c8f79afac2b63bfdc0f76020bf23d29ccf0d2dd2df7320e453b83276c454d8');
    //
    // console.log(this.web3.eth.accounts.wallet);
    // localStorage.setItem('current_user', 'arvind');
    //
    // this.web3.eth.accounts.wallet.save(PASSWORD);
  }

  getAccountAddress () {
    return this.web3.eth.accounts.wallet[0].address
  }

  getGasPriceInEth () {
    return this.web3.eth.getGasPrice()
      .then((priceInWei) => {
        return this.web3.utils.fromWei(priceInWei, 'ether');
      })
  }

  getEthersWallet () {
    const privateKey = this.web3.eth.accounts.wallet[0].privateKey

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
        if (!receipt) {
          return false;
        }

        return true;
      })
  }
}

export default new Web3Helper();
