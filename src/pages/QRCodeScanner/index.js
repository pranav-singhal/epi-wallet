/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 23/10/22
 */
import React, {useEffect} from 'react';
import { Html5Qrcode } from "html5-qrcode"

const QRCodeScanner = (props) => {
  useEffect(() => {
    try {
      const html5QrCode = new Html5Qrcode("reader");

      const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        props.onScanned(decodedText);
      };

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);

      return () => {
        html5QrCode.stop();
      }
    }
    catch (e) {
      console.log('error', e);
    }
  }, [])

  return (
    <div id='reader' />
  )
}

export default QRCodeScanner;
