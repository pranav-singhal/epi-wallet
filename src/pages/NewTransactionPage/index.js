/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 23/10/22
 */
 import React, { useEffect } from "react";
 
 import useTransaction from "../../hooks/useTransaction";
 import { useNavigate } from "react-router-dom";
 import TransactionConfirmationOverlay from "../../components/TransactionOverlay";
 import FullPageLoader from "../../components/FullPageLoader";
import useQuery from "../../hooks/useQuery";
 
 const NewTransactionPage = () => {
   const [
     shouldShowTransactionPopover,
     transactionDetails,
     initiateTransaction,
     endTransaction,
   ] = useTransaction();

//    code: {"QRId":911073,"vendorName":"meat_story","amount":0.009317}

   const query = useQuery();
   const QRId = query.get("QRId");
   const vendorNanme = query.get("vendorName");
   const amount = parseFloat(query.get("amount"));
   useEffect(() => {
    if (QRId, vendorNanme, amount) {
        const transactionDetail = {
            to: vendorNanme,
            value: amount,
            qrId: QRId,
        };

    initiateTransaction(transactionDetail);
    }
   }, [QRId, vendorNanme, amount])
 
   const navigate = useNavigate();
  
   if (shouldShowTransactionPopover) {
     return (
       <>
         <FullPageLoader message="Confirming Transaction..." size="small" />
         <TransactionConfirmationOverlay
           {...transactionDetails}
           onApprove={() => {
             endTransaction();
 
             navigate(`/chat?to=${transactionDetails.to}`);
           }}
           onDecline={() => {
             endTransaction();
 
             navigate('/');
           }}
           onCancel={() => {
             endTransaction();
 
             navigate('/');
           }}
         />
       </>
     );
   }
 
   return <div id="reader" />;
 };
 
 export default NewTransactionPage;
 