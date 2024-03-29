/**
 * @author Arvind Kalra <kalarvind97@gmail.com>
 * @profile https://github.com/arvindkalra
 * @date 14/01/23
 */
import React from "react";

const ExternalLink = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={props.size}
    height={props.size}
  >
    <path d="M40 10a2 2 0 0 0 0 4h7.172L30.586 30.586a2 2 0 1 0 2.828 2.828L50 16.828V24a2 2 0 0 0 4 0V12a2 2 0 0 0-2-2H40zm-22 2c-3.309 0-6 2.691-6 6v28c0 3.309 2.691 6 6 6h28c3.309 0 6-2.691 6-6V34a2 2 0 0 0-4 0v12c0 1.103-.897 2-2 2H18c-1.103 0-2-.897-2-2V18c0-1.103.897-2 2-2h12a2 2 0 0 0 0-4H18z" />
  </svg>
);

export default ExternalLink;
