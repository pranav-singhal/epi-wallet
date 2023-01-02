/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 23/10/22
 */
import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import useTransaction from "../../hooks/useTransaction";
import { useNavigate } from "react-router-dom";
import TransactionConfirmationOverlay from "../../components/TransactionOverlay";
import FullPageLoader from "../../components/FullPageLoader";

const QRCodeScanner = (props) => {
  const [
    shouldShowTransactionPopover,
    transactionDetails,
    initiateTransaction,
    endTransaction,
  ] = useTransaction();

  const navigate = useNavigate();

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase(),
        safari = /safari/.test( userAgent ),
        ios = /iphone|ipod|ipad/.test( userAgent );
    const isWebView = Boolean(ios) && !safari;

    // do not try to mount the scanner for webviews.
    // qr code scanning is handled explicitly in the app
    if (!isWebView) {
        try {
            const html5QrCode = new Html5Qrcode("reader");

            const qrCodeSuccessCallback = (decodedText) => {
                const qrBody = JSON.parse(decodedText),
                    transactionDetail = {
                        to: qrBody.vendorName,
                        value: qrBody.amount,
                        qrId: qrBody.QRId,
                    };

                initiateTransaction(transactionDetail);
            };

            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            html5QrCode.start(
                { facingMode: "environment" },
                config,
                qrCodeSuccessCallback,
                () => {
                    console.log("something went wrong")
                }
            );

            return () => {
                html5QrCode.stop();
            };
        } catch (e) {
            console.log("error", e);
        }
    }
  }, []);

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

            navigate(-1);
          }}
          onCancel={() => {
            endTransaction();

            navigate(-1);
          }}
        />
      </>
    );
  }

  return <div id="reader" />;
};

export default QRCodeScanner;
