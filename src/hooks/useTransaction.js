/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 30/12/22
 */
import { useState } from "react";

const useTransaction = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [transactionState, setTransactionState] = useState({});

  /**
   * Function can be used to initiate a new transaction using ConfirmTransactionOverlay
   * @param opts {Object} - Arguments for transaction
   * @param opts.to {string} - Address of the EOA whom the funds need to be sent
   * @param opts.value {number} - Amount that needs to be sent
   * @param opts.qrId {string|number} - Unique id for the QR code to which amount is going to be sent
   * @param opts.transactionId {string|number} - Unique id of the transaction that is being approved
   */
  const initiateTransaction = (opts) => {
    setShowPopover(true);
    setTransactionState(opts);
  };

  const endTransaction = () => {
    setShowPopover(false);
    setTransactionState({});
  };

  return [showPopover, transactionState, initiateTransaction, endTransaction];
};

export default useTransaction;
