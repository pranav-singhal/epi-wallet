/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 30/12/22
 */
import { useState } from "react";

const useTransaction = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [transactionState, setTransactionState] = useState({});

  const initiateTransaction = (opts) => {
    setShowPopover(true);
    setTransactionState(opts);
  };

  const endTransaction = () => {
    setShowPopover(false);
    setTransactionState({});
  }

  return [showPopover, transactionState, initiateTransaction, endTransaction]
};

export default useTransaction;
